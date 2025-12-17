import { StateCreator } from "zustand";

export interface CounterState {
    count: number;
    increase: () => void;
    reset: () => void;
}

export const createCounterStore: StateCreator<CounterState> = (set) => ({
    count: 0,
    increase: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set(() => ({ count: 0 })),
});
