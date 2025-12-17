# Этап 6: Zustand + Next.js (SSR/RSC)

## Цель
Понять особенности работы Zustand в Next.js App Router, где компоненты по умолчанию серверные, а состояние должно быть изолировано для каждого запроса (при SSR).

## Проблема
Глобальный store (созданный через `create` в глобальной области видимости) — это синглтон. В браузере (SPA) это нормально. Но на сервере Node.js этот объект будет общим для **всех** пользователей, которые делают запросы. Это может привести к утечке данных между пользователями.

## Решение: Создание Store для каждого запроса

### 1. Создание фабрики Store
Вместо экспорта хука `useStore`, экспортируйте функцию `createStore`.

```typescript
// src/store/store.ts
import { createStore } from 'zustand/vanilla'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { createPostSlice } from './createPostSlice'
import { createFavoriteSlice } from './createFavoriteSlice'
import { createCounterStore as createCounterSlice } from './counter-store' // Переименовываем для ясности, так как это slice
import type { PostSlice } from './createPostSlice'
import type { FavoriteSlice } from './createFavoriteSlice'
import type { CounterState } from './counter-store'

export type AppState = PostSlice & FavoriteSlice & CounterState

export const createAppStore = (initState: Partial<AppState> = {}) => {
  return createStore<AppState>()(
    devtools(
      persist(
        (...a) => ({
          ...createPostSlice(...a),
          ...createFavoriteSlice(...a),
          ...createCounterSlice(...a),
          ...initState,
        }),
        {
          name: 'bound-store',
          storage: createJSONStorage(() => 
            typeof window !== 'undefined' ? localStorage : undefined
          ), // Используем проверку window для безопасности на сервере (SSR)
        }
      )
    )
  )
}
```

### 2. Создание Context Provider
Нам нужно передать этот store через React Context, чтобы он был доступен в дереве компонентов, но создавался заново для каждого "прохода" рендеринга (на сервере — для каждого запроса).

```tsx
// src/providers/store-provider.tsx
'use client' // Контекст работает только в клиентских компонентах

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { type AppState, createAppStore } from '@/store/store' // Импортируем наш собранный стор

export type AppStoreApi = ReturnType<typeof createAppStore>

// Создаем контекст для стора
export const AppStoreContext = createContext<AppStoreApi | undefined>(
  undefined,
)

export interface AppStoreProviderProps {
  children: ReactNode
}

export const AppStoreProvider = ({
  children,
}: AppStoreProviderProps) => {
  // useRef гарантирует, что стор будет создан только один раз для компонента
  // Но так как провайдер будет в корне, он создастся один раз на сессию клиента (SPA)
  // или один раз на запрос сервера (SSR)
  const storeRef = useRef<AppStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createAppStore()
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  )
}

// Хук для использования стора в компонентах
export const useAppStore = <T,>(
  selector: (store: AppState) => T,
): T => {
  const appStoreContext = useContext(AppStoreContext)

  if (!appStoreContext) {
    throw new Error(`useAppStore must be used within AppStoreProvider`)
  }

  return useStore(appStoreContext, selector)
}
```

### 3. Обертка приложения
Оберните нужную часть приложения (или всё приложение в `layout.tsx`) в провайдер.

```tsx
// src/app/layout.tsx
import { AppStoreProvider } from '@/providers/store-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Оборачиваем все приложение, чтобы стор был доступен везде */}
        <AppStoreProvider>
          {children}
        </AppStoreProvider>
      </body>
    </html>
  )
}
```

Теперь состояние безопасно для SSR и изолировано. Компоненты могут использовать `useAppStore` вместо прямого импорта `useBoundStore`.

### 4. Использование в компонентах (Best Practices)

Для оптимизации рендеринга при выборе нескольких полей используйте `useShallow`. Это предотвратит лишние обновления, если изменились поля, которые вы не используете.

```tsx
// src/components/counter.tsx
'use client'

import { useAppStore } from '@/providers/store-provider'
import { useShallow } from 'zustand/react/shallow'

export const Counter = () => {
  // Используем useShallow для выбора объекта
  // Компонент перерисуется, только если изменится count или decrement/increment (а функции стабильны)
  const { count, decrement, increment } = useAppStore(
    useShallow((state) => ({
      count: state.count,
      decrement: state.decrement,
      increment: state.increment,
    }))
  )

  return (
    <div>
      Count: {count}
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  )
}
```
