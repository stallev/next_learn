# Этап 1: Основы (Store и State)

## Цель
Понять, как создавать хранилище (store), добавлять в него состояние и методы для изменения, а также использовать его в React компонентах.

## Шаги

### 1. Установка библиотеки
Выполните команду в терминале:
```bash
npm install zustand
```

### 2. Создание Store
Создайте файл `src/store/useCounterStore.ts`.
В этом файле мы создадим простой store для счетчика.

```typescript
import { create } from 'zustand'

interface CounterState {
  count: number
  increase: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))
```

### 3. Использование в компоненте
Создайте новый компонент `src/components/Counter.tsx` и используйте там хук `useCounterStore`.

```tsx
'use client';

import { useCounterStore } from '../store/useCounterStore';

export default function Counter() {
  const { count, increase, reset } = useCounterStore()

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>
      <div className="flex gap-2">
        <button 
          onClick={increase}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increase
        </button>
        <button 
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
```

### 4. Добавление на страницу
Добавьте компонент `Counter` на главную страницу `src/app/page.tsx`, чтобы проверить его работу.

### 5. DevTools (Опционально)
Для удобной отладки можно подключить Redux DevTools.
Обновите `src/store/useCounterStore.ts`:

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// ... интерфейс ...

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increase: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    { name: 'Counter Store' }
  )
)
```
Теперь, если у вас установлено расширение Redux DevTools в браузере, вы увидите изменения состояния.
