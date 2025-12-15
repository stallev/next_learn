'use client';

import { useCounterStore } from '../store/useCounterStore';

export default function Counter() {
    const { count, increase, reset } = useCounterStore();

    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>
            <div className="flex gap-2">
                <button
                    onClick={increase}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Increase
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Reset
                </button>
            </div>
        </div>
    )
}
