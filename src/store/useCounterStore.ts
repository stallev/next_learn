import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CounterState {
    count: number;
    increase: () => void;
    reset: () => void;
}

export const useCounterStore = create<CounterState>()(
    devtools((set) => ({
        count: 0,
        increase: () => set((state) => ({ count: state.count + 1 })),
        reset: () => set({ count: 0 }),
    }),
        { name: 'Counter Store' })
);
