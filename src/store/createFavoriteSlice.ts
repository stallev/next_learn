import { StateCreator } from "zustand";

export interface FavoriteSlice {
    favorites: number[];
    toggleFavorite: (id: number) => void;
}

export const createFavoriteSlice: StateCreator<FavoriteSlice> = (set) => ({
    favorites: [],
    toggleFavorite: (id: number) => set((state) => ({
        favorites: state.favorites.includes(id)
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id],
    })),
});