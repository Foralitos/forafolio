"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import { Project } from "@/models/Project";
import { uploadImage } from "@/libs/cloudinary";

// El guard del layout NO protege estas funciones: una Server Action es un
// endpoint POST propio al que se puede pegar directo. Cada una revalida.
async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  return session.user;
}

// El landing y el admin muestran la misma data; tras cualquier mutación hay que
// tirar el cache de ambos o el sitio público sigue mostrando lo viejo.
function revalidar() {
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

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
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  if (!data.title) return { error: "El título es obligatorio." };
  if (!data.description) return { error: "La descripción es obligatoria." };

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

  revalidar();
  // redirect() lanza una excepción de control de flujo: tiene que quedar fuera
  // del try o el catch se la traga y el usuario nunca sale del formulario.
  redirect("/admin/projects");
}
