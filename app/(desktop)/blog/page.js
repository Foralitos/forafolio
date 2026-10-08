import Link from "next/link";
import { Window } from "@/components/desktop/Window";
import { getPublishedPosts } from "@/models/Post";
import { getSEOTags } from "@/libs/seo";

export const dynamic = "force-dynamic";

export const metadata = getSEOTags({
  title: "Blog — Fora",
  description: "Notes from Fora on building products and software.",
  canonicalUrlRelative: "/blog",
});

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndex() {
  // Igual que Inicio y Proyectos: si Mongo falla, la ventana abre vacía en vez
  // de tumbar el escritorio.
  let posts = [];
  try {
    posts = await getPublishedPosts();
  } catch (err) {
    console.error("[blog] No se pudieron cargar posts:", err);
  }

  return (
    <Window title="Blog">
      <section className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Blog</h1>
          <p className="mt-1 text-[15px] text-desk-fg/65">
            Notes on building products, shipping, and everything in between.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="panel rounded-2xl px-6 py-10 text-center text-[15px] text-desk-fg/60">
            No posts yet. Soon.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="panel group flex flex-col overflow-hidden rounded-2xl transition-transform duration-200 hover:-translate-y-0.5 sm:flex-row"
              >
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt=""
                    className="aspect-[2/1] w-full object-cover sm:aspect-auto sm:w-56"
                  />
                ) : null}
                <div className="flex flex-col justify-center p-5">
                  <p className="text-xs text-desk-fg/50">{formatDate(post.publishedAt)}</p>
                  <h2 className="mt-1 text-lg font-semibold leading-snug tracking-tight group-hover:text-blue-500">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-desk-fg/65">
                      {post.excerpt}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Window>
  );
}
