"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import { Project, PROJECT_STATUSES } from "@/models/Project";
import { uploadImage, signUpload } from "@/libs/cloudinary";
import { slugify } from "@/libs/slug";

// El guard del layout NO protege estas funciones: una Server Action es un
// endpoint POST propio al que se puede pegar directo. Cada una revalida.
async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  return session.user;
}

// El landing y el admin muestran la misma data; tras cualquier mutación hay que
// tirar el cache de ambos o el sitio público sigue mostrando lo viejo.
function revalidar(slug) {
  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
}

// Firma para que el navegador suba galería y video directo a Cloudinary.
export async function getUploadSignature() {
  await requireUser();
  return signUpload("forafolio/projects");
}

// Lista de URLs que manda MediaUploader como JSON en un input oculto.
function leerLista(valor) {
  try {
    const lista = JSON.parse(String(valor ?? "[]"));
    return Array.isArray(lista) ? lista.filter((u) => typeof u === "string" && u) : [];
  } catch {
    return [];
  }
}

const separarPorComas = (valor) =>
  String(valor ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

export async function deleteProject(id) {
  await requireUser();
  await connectMongo();
  await Project.findByIdAndDelete(id);
  revalidar();
}

export async function toggleProject(id, published) {
  await requireUser();
  await connectMongo();
  await Project.findByIdAndUpdate(id, { published: !published });
  revalidar();
}

// Alta y edición comparten formulario: `id === "new"` significa alta, igual que
// en la ruta $id de Remix.
export async function saveProject(id, _prevState, formData) {
  await requireUser();

  const data = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    liveUrl: String(formData.get("liveUrl") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
    published: formData.get("published") === "on",
    tags: separarPorComas(formData.get("tags")),
    summary: String(formData.get("summary") ?? "").trim(),
    body: String(formData.get("body") ?? ""),
    role: String(formData.get("role") ?? "").trim(),
    stack: separarPorComas(formData.get("stack")),
    repoUrl: String(formData.get("repoUrl") ?? "").trim(),
    featured: formData.get("featured") === "on",
    heroVideo: formData.get("heroVideo") === "on",
    pitch: String(formData.get("pitch") ?? "").trim(),
    gallery: leerLista(formData.get("gallery")),
    video: String(formData.get("video") ?? "").trim(),
  };

  const year = Number(formData.get("year"));
  data.year = Number.isInteger(year) && year > 1990 ? year : null;
  const status = String(formData.get("status") ?? "live");
  data.status = PROJECT_STATUSES.includes(status) ? status : "live";

  if (!data.title) return { error: "El título es obligatorio." };
  if (!data.description) return { error: "La descripción es obligatoria." };

  data.slug = slugify(String(formData.get("slug") ?? "").trim() || data.title);
  if (!data.slug) return { error: "No se pudo generar el slug." };

  let uploadedUrl = null;
  try {
    // FormData nativo: `imageFile` ya llega como File. Esto sustituye al
    // unstable_parseMultipartFormData de Remix, que no existe en Next.
    uploadedUrl = await uploadImage(formData.get("imageFile"));
  } catch (err) {
    return { error: err.message || "No se pudo subir la imagen." };
  }

  try {
    await connectMongo();
    // El slug es la URL pública: no puede repetirse entre proyectos.
    const choque = await Project.findOne({ slug: data.slug, _id: { $ne: id === "new" ? null : id } }).lean();
    if (choque) return { error: `Ya hay otro proyecto con el slug "${data.slug}".` };

    if (id === "new") {
      await Project.create({ ...data, image: uploadedUrl ?? "" });
    } else {
      const update = { ...data };
      if (uploadedUrl) update.image = uploadedUrl;
      await Project.findByIdAndUpdate(id, update);
    }
  } catch (err) {
    return { error: err.message || "No se pudo guardar el proyecto." };
  }

  revalidar(data.slug);
  // redirect() lanza una excepción de control de flujo: tiene que quedar fuera
  // del try o el catch se la traga y el usuario nunca sale del formulario.
  redirect("/admin/projects");
}
