import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/require-user.server";
import { connectDB } from "~/lib/db.server";
import { Post, getAllPosts } from "~/models/post.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  return json({ posts: await getAllPosts() });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUser(request);
  const form = await request.formData();
  const intent = form.get("intent");
  const id = String(form.get("id") ?? "");

  await connectDB();

  if (intent === "delete") {
    await Post.findByIdAndDelete(id);
  } else if (intent === "toggle") {
    const published = form.get("published") === "true";
    await Post.findByIdAndUpdate(id, {
      published: !published,
      publishedAt: !published ? new Date() : null,
    });
  }

  return json({ ok: true });
}

export default function AdminBlog() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-pixel text-xl tracking-wider">BLOG</h1>
        <Link
          to="/admin/blog/new"
          className="border-2 border-white bg-white/10 hover:bg-white hover:text-gray-900 text-white px-4 py-2 text-sm transition-colors"
        >
          + Nuevo
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">Aún no hay posts. Escribe el primero.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 border-2 border-gray-700 bg-gray-900 p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{post.title}</p>
                <p className="text-gray-500 text-xs truncate">/{post.slug}</p>
              </div>

              <span
                className={`text-xs px-2 py-1 border ${
                  post.published
                    ? "border-green-500/40 text-green-300"
                    : "border-gray-600 text-gray-500"
                }`}
              >
                {post.published ? "Publicado" : "Borrador"}
              </span>

              <Form method="post">
                <input type="hidden" name="id" value={post.id} />
                <input
                  type="hidden"
                  name="published"
                  value={String(post.published)}
                />
                <button
                  name="intent"
                  value="toggle"
                  className="text-xs text-gray-300 hover:text-white border-2 border-gray-700 hover:border-white px-3 py-1 transition-colors"
                >
                  {post.published ? "Ocultar" : "Publicar"}
                </button>
              </Form>

              <Link
                to={`/admin/blog/${post.id}`}
                className="text-xs text-gray-300 hover:text-white border-2 border-gray-700 hover:border-white px-3 py-1 transition-colors"
              >
                Editar
              </Link>

              <Form
                method="post"
                onSubmit={(e) => {
                  if (!confirm(`¿Borrar "${post.title}"?`)) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={post.id} />
                <button
                  name="intent"
                  value="delete"
                  className="text-xs text-red-300 hover:text-white border-2 border-red-500/40 hover:border-red-400 hover:bg-red-500/10 px-3 py-1 transition-colors"
                >
                  Borrar
                </button>
              </Form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
