import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { createPostSlice } from "./createPostSlice";
import { createFavoriteSlice } from "./createFavoriteSlice";
import { PostSlice } from "./createPostSlice";
import { FavoriteSlice } from "./createFavoriteSlice";

export const useBoundStore = create<PostSlice & FavoriteSlice>()(
    devtools(
        persist(
            (...a) => ({
                ...createPostSlice(...a),
                ...createFavoriteSlice(...a),
            }),
            {
                name: 'bound-store',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    posts: state.posts,
                    favorites: state.favorites,
                }),
            }
        )
    )
)