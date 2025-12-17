import { StateCreator } from "zustand";
import { Post } from "../services/api";
import { fetchPosts } from "../services/api";

export interface PostSlice {
    posts: Post[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date;
    fetchPosts: () => Promise<void>;
}

export const createPostSlice: StateCreator<PostSlice> = (set) => ({
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
});
