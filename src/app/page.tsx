import Image from "next/image";

import PostList from "../components/PostList";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto py-10">
        <h1 className="mb-8 text-center text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Zustand Learning Playground
        </h1>
        <PostList />
      </main>
    </div>
  );
}
