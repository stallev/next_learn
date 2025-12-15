# Этап 6: Zustand + Next.js (SSR/RSC)

## Цель
Понять особенности работы Zustand в Next.js App Router, где компоненты по умолчанию серверные, а состояние должно быть изолировано для каждого запроса (при SSR).

## Проблема
Глобальный store (созданный через `create` в глобальной области видимости) — это синглтон. В браузере (SPA) это нормально. Но на сервере Node.js этот объект будет общим для **всех** пользователей, которые делают запросы. Это может привести к утечке данных между пользователями.

## Решение: Создание Store для каждого запроса

### 1. Создание фабрики Store
Вместо экспорта хука `useStore`, экспортируйте функцию `createStore`.

```typescript
// src/store/counter-store.ts
import { createStore } from 'zustand/vanilla'

export type CounterState = {
  count: number
  decrement: () => void
  increment: () => void
}

export const createCounterStore = (initState: CounterState = { count: 0 }) => {
  return createStore<CounterState>()((set) => ({
    ...initState,
    decrement: () => set((state) => ({ count: state.count - 1 })),
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
}
```

### 2. Создание Context Provider
Нам нужно передать этот store через React Context, чтобы он был доступен в дереве компонентов, но создавался заново для каждого "прохода" рендеринга (на сервере — для каждого запроса).

```tsx
// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { type CounterState, createCounterStore } from '@/store/counter-store'

export type CounterStoreApi = ReturnType<typeof createCounterStore>

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CounterStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<CounterStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createCounterStore()
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export const useCounterStore = <T,>(
  selector: (store: CounterState) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
```

### 3. Обертка приложения
Оберните нужную часть приложения (или всё приложение в `layout.tsx`) в провайдер.

```tsx
// src/app/layout.tsx
import { CounterStoreProvider } from '@/providers/counter-store-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CounterStoreProvider>
          {children}
        </CounterStoreProvider>
      </body>
    </html>
  )
}
```

Теперь состояние безопасно для SSR и изолировано.
