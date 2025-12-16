'use client';

import { useEffect } from 'react';
import { usePostStore } from '../store/usePostStore';
import { useShallow } from 'zustand/react/shallow';

export default function PostList() {
    const { posts, loading, error, fetchPosts } = usePostStore(
        useShallow((state) => ({
            posts: state.posts,
            loading: state.loading,
            error: state.error,
            fetchPosts: state.fetchPosts,
        }))
    );

    useEffect(() => {
        if (posts.length === 0) {
            fetchPosts();
        }
    }, [fetchPosts, posts.length]);

    if (loading) return <div className="p-4 text-center">Loading posts...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <div key={post.id} className="rounded-lg border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
                    <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">{post.body}</p>
                </div>
            ))}
        </div>
    );
}
