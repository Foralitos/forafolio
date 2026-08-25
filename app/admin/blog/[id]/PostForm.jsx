"use client";

import Link from "next/link";
import { useActionState } from "react";
import { savePost } from "../actions";

export default function PostForm({ id, isNew, post }) {
  const [state, formAction, saving] = useActionState(
    savePost.bind(null, id),
    null
  );

  return (
    <div className="max-w-3xl">
      <h1 className="font-pixel text-xl mb-8 tracking-wider">
        {isNew ? "NUEVO POST" : "EDITAR POST"}
      </h1>

      {state?.error ? (
        <p className="text-red-400 text-sm mb-6 border-2 border-red-500/50 bg-red-500/10 px-3 py-2">
          ⚠ {state.error}
        </p>
      ) : null}

      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm text-gray-400 mb-1">
            Título
          </label>
          <input
            id="title"
            name="title"
            defaultValue={post?.title}
            required
            className="w-full bg-gray-900 border-2 border-gray-700 focus:border-white px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm text-gray-400 mb-1">
            Slug (vacío = se genera del título)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={post?.slug}
            placeholder="mi-primer-post"
            className="w-full bg-gray-900 border-2 border-gray-700 focus:border-white px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm text-gray-400 mb-1">
            Extracto (resumen corto)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={post?.excerpt}
            rows={2}
            className="w-full bg-gray-900 border-2 border-gray-700 focus:border-white px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm text-gray-400 mb-1">
            Contenido (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            defaultValue={post?.content}
            rows={16}
            className="w-full bg-gray-900 border-2 border-gray-700 focus:border-white px-3 py-2 text-sm font-mono outline-none"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm text-gray-400 mb-1">
            Tags (separados por coma)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={post?.tags.join(", ")}
            className="w-full bg-gray-900 border-2 border-gray-700 focus:border-white px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label htmlFor="coverFile" className="block text-sm text-gray-400 mb-1">
            Imagen de portada
          </label>
          {post?.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt=""
              className="w-40 h-24 object-cover border-2 border-gray-700 mb-2"
            />
          ) : null}
          <input
            id="coverFile"
            type="file"
            name="coverFile"
            accept="image/*"
            className="block text-sm text-gray-300 file:mr-3 file:border-2 file:border-gray-700 file:bg-gray-800 file:text-white file:px-3 file:py-1 file:text-xs"
          />
          <p className="text-gray-600 text-xs mt-1">
            Máx 4MB (tope de Vercel por request).
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? false}
            className="w-4 h-4 accent-white"
          />
          Publicado
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="border-2 border-white bg-white text-gray-900 px-6 py-2 text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
          <Link
            href="/admin/blog"
            className="border-2 border-gray-700 text-gray-300 hover:border-white hover:text-white px-6 py-2 text-sm transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
