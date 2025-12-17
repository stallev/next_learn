import { create } from "zustand";
import { Post, fetchPosts } from "../services/api";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date;
    fetchPosts: () => Promise<void>;
    favorites: number[];
    toggleFavorite: (id: number) => void;
}

export const usePostStore = create<PostState>()(
    devtools(persist((set) => ({
        posts: [],
        loading: false,
        error: null,
        lastUpdated: new Date(),
        fetchPosts: async () => {
            set({ loading: true, error: null, lastUpdated: new Date() });
            try {
                const posts = await fetchPosts();
                set({ posts, loading: false });
            } catch (error) {
                set({ error: (error as Error).message, loading: false });
            }
        },
        favorites: [],
        toggleFavorite: (id: number) => set((state) => ({
            favorites: state.favorites.includes(id)
                ? state.favorites.filter((favId) => favId !== id)
                : [...state.favorites, id],
        })),
    }),
        {
            name: 'Post Store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                posts: state.posts,
                favorites: state.favorites,
            }),
        }),
    )
)
