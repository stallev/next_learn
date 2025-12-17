'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type AppState, createAppStore } from '@/store/store'
import { useStore } from '@/hooks/useStore'

export type AppStoreApi = ReturnType<typeof createAppStore>

export const AppStoreContext = createContext<AppStoreApi | undefined>(
    undefined,
)

export interface AppStoreProviderProps {
    children: ReactNode
}

export const AppStoreProvider = ({
    children,
}: AppStoreProviderProps) => {
    const storeRef = useRef<AppStoreApi>(undefined)
    if (!storeRef.current) {
        storeRef.current = createAppStore()
    }

    return (
        <AppStoreContext.Provider value={storeRef.current}>
            {children}
        </AppStoreContext.Provider>
    )
}

export const useAppStore = <T,>(
    selector: (store: AppState) => T,
): T | undefined => {
    const appStoreContext = useContext(AppStoreContext)

    if (!appStoreContext) {
        throw new Error(`useAppStore must be used within AppStoreProvider`)
    }

    return useStore(appStoreContext as any, selector)
}
