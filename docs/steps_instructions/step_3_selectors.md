# Этап 3: Селекторы и Оптимизация (Selectors)

## Цель
Понять, как избегать лишних ререндеров компонентов, выбирая из стора только необходимые данные.

## Проблема
Если использовать `const { posts, loading } = usePostStore()`, компонент будет перерисовываться при изменении *любого* поля в сторе, даже если изменилось поле, которое компонент не использует (например, если мы добавим поле `filter`, которое `PostList` не использует напрямую, но деструктуризация заставит его обновиться, так как возвращается новый объект состояния).

*Примечание: В последних версиях React и Zustand это оптимизировано, но использование селекторов — хорошая практика.*

## Шаги

### 1. Использование атомарных селекторов
Вместо получения всего объекта состояния, выбирайте конкретные поля.

В `src/components/PostList.tsx`:

```tsx
// Было
// const { posts, loading, error, fetchPosts } = usePostStore();

// Стало (лучшая производительность)
const posts = usePostStore((state) => state.posts)
const loading = usePostStore((state) => state.loading)
const error = usePostStore((state) => state.error)
const fetchPosts = usePostStore((state) => state.fetchPosts)
```

### 2. Использование useShallow
Если вам нужно достать несколько полей сразу и вы хотите вернуть объект, используйте `useShallow`, чтобы избежать ререндеров, если поля внутри объекта не изменились.

```tsx
import { useShallow } from 'zustand/react/shallow'

// ...

const { posts, loading, error } = usePostStore(
  useShallow((state) => ({
    posts: state.posts,
    loading: state.loading,
    error: state.error,
  }))
)
```

### 3. Практика
Попробуйте добавить в store поле `lastUpdated: Date` и обновлять его при каждом fetch.
Создайте отдельный компонент `LastUpdated.tsx`, который подписывается *только* на это поле.
Убедитесь (с помощью `console.log` внутри компонентов), что `PostList` не ререндерится лишний раз, если обновляется только `lastUpdated` (хотя в данном случае они связаны, но принцип разделения важен).
