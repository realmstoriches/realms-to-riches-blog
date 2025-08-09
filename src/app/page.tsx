// src/app/page.tsx (The Final, Polished Version)

import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";

// The query to fetch all published posts, ordered by date
const POSTS_QUERY = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt
}`;

export default async function IndexPage() {
  // Fetch the posts from Sanity
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, { next: { revalidate: 30 } });

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      {/* This wrapper centers the content and sets a max width */}
      <div className="w-full max-w-3xl">
        
        {/* The main header for your blog */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Realms to Riches Blog
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Forging Digital Empires with AI-Driven Content
          </p>
        </header>

        {/* The container for the list of post "cards" */}
        <div className="flex flex-col gap-y-8">
          {posts.map((post) => (
            <Link
              href={`/${post.slug}`}
              key={post._id}
              // These classes create the "card" look and hover effect
              className="block p-6 bg-gray-900 border border-gray-800 rounded-lg shadow-lg hover:border-blue-500 transition-colors duration-300 ease-in-out"
            >
              <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
              <p className="text-gray-400">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
        
      </div>
    </main>
  );
}