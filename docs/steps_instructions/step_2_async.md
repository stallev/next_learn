# Этап 2: Асинхронные действия (Async Actions)

## Цель
Научиться работать с асинхронными операциями (например, запросами к API) внутри Zustand store.

## Шаги

### 1. Создание Store для постов
Создайте файл `src/store/usePostStore.ts`.
Определите интерфейс состояния, который будет включать массив постов, флаг загрузки и ошибку.

```typescript
import { create } from 'zustand'
import { Post, fetchPosts } from '../services/api'

interface PostState {
  posts: Post[]
  loading: boolean
  error: string | null
  fetchPosts: () => Promise<void>
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  loading: false,
  error: null,
  fetchPosts: async () => {
    set({ loading: true, error: null })
    try {
      const posts = await fetchPosts()
      set({ posts, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },
}))
```

### 2. Обновление компонента PostList
Измените `src/components/PostList.tsx`, чтобы он использовал `usePostStore` вместо локального `useState`.

```tsx
'use client';

import { useEffect } from 'react';
import { usePostStore } from '../store/usePostStore';

export default function PostList() {
  // Используем селектор или деструктуризацию (на следующем этапе оптимизируем)
  const { posts, loading, error, fetchPosts } = usePostStore();

  useEffect(() => {
    // Загружаем посты только если их нет (простой пример кеширования)
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [fetchPosts, posts.length]);

  if (loading) return <div className="p-4 text-center">Loading posts...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id} className="rounded-lg border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{post.body}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Проверка
Запустите приложение. Визуально ничего не должно измениться, но теперь данные управляются глобальным стором. Попробуйте перейти на другую страницу (если есть) и вернуться — данные должны остаться (если мы добавили проверку `if (posts.length === 0)`).
