import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { requireUser } from "~/services/require-user.server";
import { connectDB } from "~/lib/db.server";
import { Post, getPostById, slugify } from "~/models/post.server";
import { uploadImage } from "~/services/cloudinary.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUser(request);
  const isNew = params.id === "new";
  const post = isNew ? null : await getPostById(params.id!);
  if (!isNew && !post) throw new Response("Not Found", { status: 404 });
  return json({ post, isNew });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireUser(request);

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 5_000_000,
  });
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  const coverFile = form.get("coverFile");
  const uploadedUrl =
    coverFile instanceof File ? await uploadImage(coverFile, "forafolio/blog") : null;

  const title = String(form.get("title") ?? "").trim();
  const slugInput = String(form.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const published = form.get("published") === "on";

  if (!title || !slug) {
    return json({ error: "Título y slug son obligatorios." }, { status: 400 });
  }

  const data = {
    title,
    slug,
    excerpt: String(form.get("excerpt") ?? "").trim(),
    content: String(form.get("content") ?? ""),
    tags: String(form.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    published,
  };

  await connectDB();

  try {
    if (params.id === "new") {
      await Post.create({
        ...data,
        coverImage: uploadedUrl ?? "",
        publishedAt: published ? new Date() : null,
      });
    } else {
      const existing = await getPostById(params.id!);
      const update: Record<string, unknown> = { ...data };
      if (uploadedUrl) update.coverImage = uploadedUrl;
      // Fija publishedAt la primera vez que se publica.
      if (published && !existing?.publishedAt) update.publishedAt = new Date();
      if (!published) update.publishedAt = null;
      await Post.findByIdAndUpdate(params.id, update);
    }
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("E11000")
        ? "Ya existe un post con ese slug."
        : "No se pudo guardar el post.";
    return json({ error: message }, { status: 400 });
  }

  return redirect("/admin/blog");
}

export default function PostEditor() {
  const { post, isNew } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const saving = nav.state === "submitting";

  return (
    <div className="max-w-3xl">
      <h1 className="font-pixel text-xl mb-8 tracking-wider">
        {isNew ? "NUEVO POST" : "EDITAR POST"}
      </h1>

      {actionData && "error" in actionData && actionData.error ? (
        <p className="text-red-400 text-sm mb-6 border-2 border-red-500/50 bg-red-500/10 px-3 py-2">
          ⚠ {actionData.error}
        </p>
      ) : null}

      <Form method="post" encType="multipart/form-data" className="space-y-5">
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
          <a
            href="/admin/blog"
            className="border-2 border-gray-700 text-gray-300 hover:border-white hover:text-white px-6 py-2 text-sm transition-colors"
          >
            Cancelar
          </a>
        </div>
      </Form>
    </div>
  );
}
