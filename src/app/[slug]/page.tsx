// src/app/[slug]/page.tsx (The Final, Type-Safe, and Corrected Version)

import { PortableText, type SanityDocument, type PortableTextReactComponents } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
const { projectId, dataset } = client.config();

const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const ptComponents: Partial<PortableTextReactComponents> = { /* ... your components ... */ };

// --- THIS IS THE CORRECTED PART ---
export default async function PostPage({ params }: { params: { slug: string } }) {
  // We no longer need to `await params` because it's a plain object
  const post = await client.fetch<SanityDocument>(POST_QUERY, params, { next: { revalidate: 30 } });

  if (!post) {
    return <main className="text-center p-24 text-white">Post not found.</main>;
  }

  const postImageUrl = post.mainImage ? urlFor(post.mainImage)?.width(1200).quality(80).url() : null;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      {/* ... the rest of your JSX is correct and does not need to change ... */}
      <div className="w-full max-w-3xl">
        <Link href="/" className="text-blue-400 hover:text-blue-300 hover:underline mb-8 block transition-colors">
          ← Back to All Posts
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          {post.title}
        </h1>
        <p className="text-gray-400 mb-8">
          Published on: {new Date(post.publishedAt).toLocaleDateString()}
        </p>
        {postImageUrl && (
          <Image
            src={postImageUrl}
            alt={post.title || 'Blog post image'}
            width={1200}
            height={675}
            className="w-full h-auto rounded-xl object-cover mb-8 border border-gray-800"
            priority
          />
        )}
        {post.body && (
          <div className="prose prose-xl prose-invert w-full max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300">
            <PortableText value={post.body} components={ptComponents} />
          </div>
        )}
      </div>
    </main>
  );
}