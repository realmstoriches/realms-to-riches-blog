// src/app/[slug]/page.tsx (The Final, Type-Safe, and Optimized Version)

import { PortableText, type SanityDocument, type PortableTextReactComponents } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image"; // <-- 1. IMPORT the optimized Image component
import React from "react";

// --- QUERIES AND CONFIGURATION ---

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
const { projectId, dataset } = client.config();

const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

// --- 2. STYLED COMPONENTS WITH CORRECT TYPES ---
// We've replaced all the `any` types with specific, correct types like React.ReactNode

const ptComponents: Partial<PortableTextReactComponents> = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-extrabold text-white mt-12 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold text-white mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-700 pl-4 italic my-6 text-gray-300">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 my-6">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-2 my-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-gray-300">{children}</li>,
    number: ({ children }) => <li className="text-gray-300">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a href={value.href} rel={rel} className="text-blue-400 hover:text-blue-300 underline transition-colors">
          {children}
        </a>
      );
    },
  },
};

// --- REACT SERVER COMPONENT ---

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, params, { next: { revalidate: 30 } });

  if (!post) {
    return <main className="text-center p-24 text-white">Post not found.</main>;
  }

  const postImageUrl = post.mainImage ? urlFor(post.mainImage)?.width(1200).quality(80).url() : null;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
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

        {/* 3. UPGRADED to the optimized Next.js Image component */}
        {postImageUrl && (
          <Image
            src={postImageUrl}
            alt={post.title || 'Blog post image'}
            width={1200}
            height={675} // Assuming a 16:9 aspect ratio
            className="w-full h-auto rounded-xl object-cover mb-8 border border-gray-800"
            priority // Helps with LCP performance
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