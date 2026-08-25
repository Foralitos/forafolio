import Link from "next/link";
import { getPublishedPosts } from "@/models/Post";
import { getSEOTags } from "@/libs/seo";

export const dynamic = "force-dynamic";

export const metadata = getSEOTags({
  title: "Blog — Fora",
  description: "Escritos de Fora sobre desarrollo y producto.",
  canonicalUrlRelative: "/blog",
});

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <Link
          href="/"
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
                <Link href={`/blog/${post.slug}`} className="group block">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
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
