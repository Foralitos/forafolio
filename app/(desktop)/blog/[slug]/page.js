import { Window } from "@/components/desktop/Window";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/models/Post";
import { renderMarkdown } from "@/libs/markdown";
import { getSEOTags } from "@/libs/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — Fora" };

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
  return new Date(iso).toLocaleDateString("en-US", {
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
    <Window title={post.title} backHref="/blog">
      <article className="mx-auto max-w-2xl px-5 py-8 md:px-8 md:py-12">
        <p className="text-xs text-desk-fg/50">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-3 text-[17px] leading-relaxed text-desk-fg/65">{post.excerpt}</p>
        ) : null}

        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="mt-8 aspect-[2/1] w-full rounded-2xl object-cover"
          />
        ) : null}

        <div
          className="prose-blog mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </Window>
  );
}
