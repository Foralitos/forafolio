import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { requireUser } from "~/services/require-user.server";
import { connectDB } from "~/lib/db.server";
import { Project, getProjectById } from "~/models/project.server";
import { uploadImage } from "~/services/cloudinary.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUser(request);
  const isNew = params.id === "new";
  const project = isNew ? null : await getProjectById(params.id!);
  if (!isNew && !project) throw new Response("Not Found", { status: 404 });
  return json({ project, isNew });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireUser(request);

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 5_000_000, // 5MB
  });
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  const imageFile = form.get("imageFile");
  const uploadedUrl =
    imageFile instanceof File ? await uploadImage(imageFile) : null;

  const data = {
    title: String(form.get("title") ?? "").trim(),
    description: String(form.get("description") ?? "").trim(),
    liveUrl: String(form.get("liveUrl") ?? "").trim(),
    order: Number(form.get("order") ?? 0),
    published: form.get("published") === "on",
    tags: String(form.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  await connectDB();

  if (params.id === "new") {
    await Project.create({ ...data, image: uploadedUrl ?? "" });
  } else {
    const update: Record<string, unknown> = { ...data };
    if (uploadedUrl) update.image = uploadedUrl;
    await Project.findByIdAndUpdate(params.id, update);
  }

  return redirect("/admin/projects");
}

export default function ProjectForm() {
  const { project, isNew } = useLoaderData<typeof loader>();
  const nav = useNavigation();
  const saving = nav.state === "submitting";

  return (
    <div className="max-w-2xl">
      <h1 className="font-pixel text-xl mb-8 tracking-wider">
        {isNew ? "NUEVO PROYECTO" : "EDITAR PROYECTO"}
      </h1>

      <Form
        method="post"
        encType="multipart/form-data"
        className="space-y-5"
      >
        <Field label="Título" name="title" defaultValue={project?.title} required />

        <div>
          <label
            htmlFor="description"
            className="block text-sm text-gray-400 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={project?.description}
            rows={3}
            required
            className="w-full bg-gray-900 border-2 border-gray-700 focus:border-white px-3 py-2 text-sm outline-none"
          />
        </div>

        <Field
          label="Tags (separados por coma)"
          name="tags"
          defaultValue={project?.tags.join(", ")}
        />

        <Field
          label="URL del proyecto"
          name="liveUrl"
          type="url"
          defaultValue={project?.liveUrl}
        />

        <Field
          label="Orden (menor = primero)"
          name="order"
          type="number"
          defaultValue={String(project?.order ?? 0)}
        />

        <div>
          <label htmlFor="imageFile" className="block text-sm text-gray-400 mb-1">
            Imagen
          </label>
          {project?.image ? (
            <img
              src={project.image}
              alt=""
              className="w-32 h-24 object-cover border-2 border-gray-700 mb-2"
            />
          ) : null}
          <input
            id="imageFile"
            type="file"
            name="imageFile"
            accept="image/*"
            className="block text-sm text-gray-300 file:mr-3 file:border-2 file:border-gray-700 file:bg-gray-800 file:text-white file:px-3 file:py-1 file:text-xs"
          />
          <p className="text-gray-600 text-xs mt-1">
            {isNew
              ? "Sube una imagen (máx 5MB)."
              : "Deja vacío para conservar la imagen actual."}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={project?.published ?? true}
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
            href="/admin/projects"
            className="border-2 border-gray-700 text-gray-300 hover:border-white hover:text-white px-6 py-2 text-sm transition-colors"
          >
            Cancelar
          </a>
        </div>
      </Form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full bg-gray-900 border-2 border-gray-700 focus:border-white px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}
