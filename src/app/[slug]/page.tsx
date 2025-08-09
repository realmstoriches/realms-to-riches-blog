// src/app/[slug]/page.tsx (The Final Version with Styled Components)

import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";

// --- QUERIES AND CONFIGURATION ---

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
const { projectId, dataset } = client.config();

const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

// --- 1. STYLED COMPONENTS FOR PORTABLE TEXT ---
// This is the new, crucial part. We are defining exactly how
// to render each type of block from Sanity.

const ptComponents = {
  types: {
    image: ({ value }: { value: SanityImageSource }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <img
          alt={value.alt || ' '}
          loading="lazy"
          src={urlFor(value)?.width(800).fit('max').auto('format').url()}
          className="my-8 rounded-lg"
        />
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-extrabold text-white mt-12 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-bold text-white mt-10 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h3>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-gray-700 pl-4 italic my-6 text-gray-300">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-2 my-6">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 my-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-gray-300">{children}</li>,
    number: ({ children }: any) => <li className="text-gray-300">{children}</li>,
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a href={value.href} rel={rel} className="text-blue-400 hover:text-blue-300 underline transition-colors">
          {children}
        </a>
      );
    },
  },
};

// --- 2. THE MAIN REACT SERVER COMPONENT ---

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, params, { next: { revalidate: 30 } });

  if (!post) {
    return <main className="text-center p-24 text-white">Post not found.</main>;
  }

  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(1200).quality(80).url()
    : null;

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
        {postImageUrl && (
          <img
            src={postImageUrl}
            alt={post.title || 'Blog post image'}
            className="aspect-video w-full rounded-xl object-cover mb-8 border border-gray-800"
          />
        )}
        {post.body && (
          // We no longer need the 'prose' class here.
          // We pass our custom components directly to PortableText.
          <div className="text-lg text-gray-300 leading-relaxed">
            <PortableText value={post.body} components={ptComponents} />
          </div>
        )}
      </div>
    </main>
  );
}