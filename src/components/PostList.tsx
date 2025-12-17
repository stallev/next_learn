'use client';

import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useBoundStore } from '../store/useBoundStore';
import useStore from '../hooks/useStore';

export default function PostList() {
    const storeData = useStore(
        useBoundStore,
        useShallow((state) => ({
            posts: state.posts,
            loading: state.loading,
            error: state.error,
            fetchPosts: state.fetchPosts,
            favorites: state.favorites,
            toggleFavorite: state.toggleFavorite,
        }))
    );

    useEffect(() => {
        if (storeData && storeData.posts.length === 0) {
            storeData.fetchPosts();
        }
    }, [storeData]);

    // If storeData is undefined (during hydration), render a fallback or nothing
    if (!storeData) return <div>Loading store...</div>;

    const { posts, loading, error, favorites, toggleFavorite } = storeData;

    if (loading) return <div className="p-4 text-center">Loading posts...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <div key={post.id} className="rounded-lg border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
                    <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">{post.body}</p>
                    <button onClick={() => toggleFavorite(post.id)} className="mt-2 p-2 cursor-pointer border border-red-500 border-rounded-full text-red-500 hover:text-red-600 transition-colors duration-200 ease-in-out">
                        {favorites.includes(post.id) ? 'Remove from favorites' : 'Add to favorites'}
                    </button>
                </div>
            ))}
        </div>
    );
}
