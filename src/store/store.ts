import { createStore } from 'zustand/vanilla'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { createPostSlice } from './createPostSlice'
import { createFavoriteSlice } from './createFavoriteSlice'
import { createCounterStore as createCounterSlice } from './counter-store'
import type { PostSlice } from './createPostSlice'
import type { FavoriteSlice } from './createFavoriteSlice'
import type { CounterState } from './counter-store'

export type AppState = PostSlice & FavoriteSlice & CounterState

export const createAppStore = (initState: Partial<AppState> = {}) => {
    return createStore<AppState>()(
        devtools(
            persist(
                (...a) => ({
                    ...createPostSlice(...a),
                    ...createFavoriteSlice(...a),
                    ...createCounterSlice(...a),
                    ...initState,
                }),
                {
                    name: 'bound-store',
                    storage: createJSONStorage(() => {
                        if (typeof window !== 'undefined') {
                            return window.localStorage
                        }
                        return {
                            getItem: () => null,
                            setItem: () => { },
                            removeItem: () => { },
                        }
                    }),
                }
            )
        )
    )
}