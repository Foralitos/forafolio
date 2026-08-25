import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/models/Post";
import { renderMarkdown } from "@/libs/markdown";
import { getSEOTags } from "@/libs/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post no encontrado — Fora" };

  return getSEOTags({
    title: `${post.title} — Fora`,
    description: post.excerpt || post.title,
    canonicalUrlRelative: `/blog/${post.slug}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
    },
  });
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  // Equivale al `throw new Response("Not Found", { status: 404 })` del loader.
  if (!post) notFound();

  const html = renderMarkdown(post.content);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <article className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <Link
          href="/blog"
          className="text-gray-500 hover:text-white text-sm transition-colors"
        >
          ← Blog
        </Link>

        <p className="text-gray-500 text-xs mt-8 mb-3">
          {formatDate(post.publishedAt)}
        </p>
        <h1 className="font-mondwest text-3xl md:text-4xl mb-6 leading-tight">
          {post.title}
        </h1>

        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="w-full aspect-[2/1] object-cover border-2 border-gray-700 mb-10"
          />
        ) : null}

        <div
          className="prose-blog max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
}
