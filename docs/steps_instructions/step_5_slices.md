# Этап 5: Разделение Store (Slices Pattern)

## Цель
Научиться разделять большой store на логические части (слайсы) для улучшения читаемости и поддержки кода.

## Шаги

### 1. Создание слайсов
Вместо одного большого файла, создадим `src/store/slices/createPostSlice.ts` и `src/store/slices/createFavoriteSlice.ts`.

**createPostSlice.ts**
```typescript
import { StateCreator } from 'zustand'
import { Post } from '../../services/api'

export interface PostSlice {
  posts: Post[]
  fetchPosts: () => Promise<void>
}

export const createPostSlice: StateCreator<PostSlice> = (set) => ({
  posts: [],
  fetchPosts: async () => { /* ... */ },
})
```

**createFavoriteSlice.ts**
```typescript
import { StateCreator } from 'zustand'

export interface FavoriteSlice {
  favorites: number[]
  toggleFavorite: (id: number) => void
}

export const createFavoriteSlice: StateCreator<FavoriteSlice> = (set) => ({
  favorites: [],
  toggleFavorite: (id) => { /* ... */ },
})
```

### 2. Объединение в один Store
Создайте `src/store/useBoundStore.ts`.

```typescript
import { create } from 'zustand'
import { createPostSlice, PostSlice } from './slices/createPostSlice'
import { createFavoriteSlice, FavoriteSlice } from './slices/createFavoriteSlice'

export const useBoundStore = create<PostSlice & FavoriteSlice>()((...a) => ({
  ...createPostSlice(...a),
  ...createFavoriteSlice(...a),
}))
```

### 3. Использование
В компонентах теперь импортируйте `useBoundStore`.

```tsx
import { useBoundStore } from '../store/useBoundStore'

// ...
const posts = useBoundStore((state) => state.posts)
const toggleFavorite = useBoundStore((state) => state.toggleFavorite)
```

Это позволяет держать логику разделенной, но использовать её как единый store.
