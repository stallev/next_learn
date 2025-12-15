# Этап 4: Сохранение состояния (Persist Middleware)

## Цель
Научиться сохранять состояние приложения в `localStorage` (или другом хранилище), чтобы оно не сбрасывалось при перезагрузке страницы.

## Шаги

### 1. Добавление функционала "Избранное"
Сначала добавим логику избранного в `src/store/usePostStore.ts`.

```typescript
interface PostState {
  // ... старые поля
  favorites: number[] // ID избранных постов
  toggleFavorite: (id: number) => void
}

export const usePostStore = create<PostState>((set) => ({
  // ... старые поля
  favorites: [],
  toggleFavorite: (id) => set((state) => {
    if (state.favorites.includes(id)) {
      return { favorites: state.favorites.filter(fId => fId !== id) }
    }
    return { favorites: [...state.favorites, id] }
  }),
}))
```

### 2. Подключение persist middleware
Оберните создание стора в `persist`.

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ... интерфейс ...

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      // ... вся логика стора ...
      posts: [],
      favorites: [],
      // ...
    }),
    {
      name: 'post-storage', // уникальное имя ключа в localStorage
      storage: createJSONStorage(() => localStorage), // (опционально) по умолчанию localStorage
      partialize: (state) => ({ favorites: state.favorites }), // (Важно!) Сохраняем ТОЛЬКО избранное, посты кешировать не обязательно
    }
  )
)
```

### 3. Обновление UI
Добавьте кнопку "Like" в компонент `PostList`.

```tsx
// Внутри map
const { toggleFavorite, favorites } = usePostStore(useShallow(state => ({ 
  toggleFavorite: state.toggleFavorite, 
  favorites: state.favorites 
})))

// ...
<button 
  onClick={() => toggleFavorite(post.id)}
  className={favorites.includes(post.id) ? 'text-red-500' : 'text-gray-400'}
>
  ♥
</button>
```

### 4. Проблема гидратации (Hydration Error)
В Next.js при использовании `persist` может возникнуть ошибка гидратации, так как на сервере `localStorage` пуст, а на клиенте — нет. HTML будет отличаться.

**Решение:**
Использовать кастомный хук для безопасного доступа к стору или отложить рендеринг зависимых от стора частей до `useEffect`.

Самый простой способ для Next.js — создать хук `useStore` (обертка):

```typescript
// src/hooks/useStore.ts
import { useState, useEffect } from 'react'

const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F
  const [data, setData] = useState<F>()

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}

export default useStore
```
*Примечание: Это продвинутая техника, для начала можно просто проверять `mounted` состояние в компоненте.*
