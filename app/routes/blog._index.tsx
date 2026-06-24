import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublishedPosts } from "~/models/post.server";

export const meta: MetaFunction = () => [
  { title: "Blog — Fora" },
  { name: "description", content: "Escritos de Fora sobre desarrollo y producto." },
];

export async function loader() {
  return json({ posts: await getPublishedPosts() });
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <Link
          to="/"
          className="text-gray-500 hover:text-white text-sm transition-colors"
        >
          ← Fora Delgado
        </Link>

        <h1 className="font-pixel text-2xl md:text-3xl mt-8 mb-4 tracking-wider">
          BLOG
        </h1>
        <div className="w-full max-w-md h-1 bg-white mb-12" />

        {posts.length === 0 ? (
          <p className="text-gray-500">Todavía no hay posts publicados.</p>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.id}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt=""
                      className="w-full aspect-[2/1] object-cover border-2 border-gray-700 mb-4 group-hover:border-white transition-colors"
                    />
                  ) : null}
                  <p className="text-gray-500 text-xs mb-2">
                    {formatDate(post.publishedAt)}
                  </p>
                  <h2 className="font-mondwest text-xl md:text-2xl group-hover:text-violet-300 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="text-gray-400 text-sm mt-2">{post.excerpt}</p>
                  ) : null}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
