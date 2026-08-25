"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import { Post, getPostById, slugify } from "@/models/Post";
import { uploadImage } from "@/libs/cloudinary";

// Ver app/admin/projects/actions.js: el guard del layout no cubre las Server
// Actions, así que cada una revalida la sesión.
async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  return session.user;
}

function revalidar(slug) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  // El sitemap se prerenderiza en build: sin esto, publicar un post no lo
  // anuncia a los crawlers hasta el siguiente deploy.
  revalidatePath("/sitemap.xml");
}

export async function deletePost(id, slug) {
  await requireUser();
  await connectMongo();
  await Post.findByIdAndDelete(id);
  revalidar(slug);
}

export async function togglePost(id, published, slug) {
  await requireUser();
  await connectMongo();
  await Post.findByIdAndUpdate(id, {
    published: !published,
    publishedAt: !published ? new Date() : null,
  });
  revalidar(slug);
}

export async function savePost(id, _prevState, formData) {
  await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const published = formData.get("published") === "on";

  if (!title || !slug) {
    return { error: "Título y slug son obligatorios." };
  }

  const data = {
    title,
    slug,
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? ""),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    published,
  };

  let uploadedUrl = null;
  try {
    uploadedUrl = await uploadImage(formData.get("coverFile"), "forafolio/blog");
  } catch (err) {
    return { error: err.message || "No se pudo subir la portada." };
  }

  try {
    await connectMongo();
    if (id === "new") {
      await Post.create({
        ...data,
        coverImage: uploadedUrl ?? "",
        publishedAt: published ? new Date() : null,
      });
    } else {
      const existing = await getPostById(id);
      const update = { ...data };
      if (uploadedUrl) update.coverImage = uploadedUrl;
      // Fija publishedAt la primera vez que se publica.
      if (published && !existing?.publishedAt) update.publishedAt = new Date();
      if (!published) update.publishedAt = null;
      await Post.findByIdAndUpdate(id, update);
    }
  } catch (err) {
    const message = String(err?.message || "").includes("E11000")
      ? "Ya existe un post con ese slug."
      : "No se pudo guardar el post.";
    return { error: message };
  }

  revalidar(slug);
  // Fuera del try: redirect() lanza para cortar el flujo y el catch se lo
  // tragaría, dejando al usuario atorado en el formulario.
  redirect("/admin/blog");
}
