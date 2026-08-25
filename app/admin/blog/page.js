import Link from "next/link";
import { getAllPosts } from "@/models/Post";
import ConfirmSubmit from "../ConfirmSubmit";
import { deletePost, togglePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-pixel text-xl tracking-wider">BLOG</h1>
        <Link
          href="/admin/blog/new"
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

              <form
                action={togglePost.bind(null, post.id, post.published, post.slug)}
              >
                <button
                  type="submit"
                  className="text-xs text-gray-300 hover:text-white border-2 border-gray-700 hover:border-white px-3 py-1 transition-colors"
                >
                  {post.published ? "Ocultar" : "Publicar"}
                </button>
              </form>

              <Link
                href={`/admin/blog/${post.id}`}
                className="text-xs text-gray-300 hover:text-white border-2 border-gray-700 hover:border-white px-3 py-1 transition-colors"
              >
                Editar
              </Link>

              <ConfirmSubmit
                action={deletePost.bind(null, post.id, post.slug)}
                message={`¿Borrar "${post.title}"?`}
                className="text-xs text-red-300 hover:text-white border-2 border-red-500/40 hover:border-red-400 hover:bg-red-500/10 px-3 py-1 transition-colors"
              >
                Borrar
              </ConfirmSubmit>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
