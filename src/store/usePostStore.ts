import { create } from "zustand";
import { Post, fetchPosts } from "../services/api";
import { devtools } from "zustand/middleware";

interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date;
    fetchPosts: () => Promise<void>;
}

export const usePostStore = create<PostState>()(
    devtools((set) => ({
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
    }),
        { name: 'Post Store' })
)
