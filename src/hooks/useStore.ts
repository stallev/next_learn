import { useState, useEffect } from 'react'
import { useStore as useZustandStore } from 'zustand'

export const useStore = <T, F>(
    store: any,
    callback: (state: T) => F
) => {
    const result = useZustandStore(store, callback as any) as F
    const [data, setData] = useState<F>()

    useEffect(() => {
        setData(result)
    }, [result])

    return data
}
