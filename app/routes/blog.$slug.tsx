import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPostBySlug } from "~/models/post.server";
import { renderMarkdown } from "~/lib/markdown.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) return [{ title: "Post no encontrado — Fora" }];
  return [
    { title: `${data.post.title} — Fora` },
    { name: "description", content: data.post.excerpt || data.post.title },
    { property: "og:title", content: data.post.title },
    { property: "og:description", content: data.post.excerpt || data.post.title },
    ...(data.post.coverImage
      ? [{ property: "og:image", content: data.post.coverImage }]
      : []),
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPostBySlug(params.slug!);
  if (!post) throw new Response("Not Found", { status: 404 });
  return json({ post, html: renderMarkdown(post.content) });
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost() {
  const { post, html } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <article className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <Link
          to="/blog"
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
