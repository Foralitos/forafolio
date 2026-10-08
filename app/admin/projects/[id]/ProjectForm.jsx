"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProject } from "../actions";
import MediaUploader from "./MediaUploader";

const inputClase =
  "w-full bg-gray-900 border-2 border-gray-700 focus:border-white px-3 py-2 text-sm outline-none";

function Field({ label, name, defaultValue, type = "text", required = false, hint }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={inputClase}
      />
      {hint ? <p className="text-gray-600 text-xs mt-1">{hint}</p> : null}
    </div>
  );
}

function Seccion({ titulo, children }) {
  return (
    <fieldset className="space-y-5 border-t-2 border-gray-800 pt-6">
      <legend className="font-pixel text-xs tracking-wider text-gray-400 pr-3">{titulo}</legend>
      {children}
    </fieldset>
  );
}

export default function ProjectForm({ id, isNew, project }) {
  // useActionState sustituye al par useNavigation + useActionData de Remix:
  // devuelve el estado que regresó la action y un flag de "en vuelo".
  const [state, formAction, saving] = useActionState(
    saveProject.bind(null, id),
    null
  );

  return (
    <div className="max-w-2xl">
      <h1 className="font-pixel text-xl mb-8 tracking-wider">
        {isNew ? "NUEVO PROYECTO" : "EDITAR PROYECTO"}
      </h1>

      {state?.error ? (
        <p className="text-red-400 text-xs mb-6 border-2 border-red-500/50 bg-red-500/10 px-3 py-2">
          ⚠ {state.error}
        </p>
      ) : null}

      <form action={formAction} className="space-y-5">
        <Field
          label="Título"
          name="title"
          defaultValue={project?.title}
          required
        />

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
            // eslint-disable-next-line @next/next/no-img-element
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
              ? "Sube una imagen (máx 4MB)."
              : "Deja vacío para conservar la imagen actual."}
          </p>
        </div>

        <Seccion titulo="PÁGINA DEL PROYECTO">
          <Field
            label="Slug (URL: /projects/…)"
            name="slug"
            defaultValue={project?.slug}
            hint="Vacío = se genera del título."
          />
          <Field label="Frase corta (summary)" name="summary" defaultValue={project?.summary} />
          <div>
            <label htmlFor="body" className="block text-sm text-gray-400 mb-1">
              Texto largo (markdown)
            </label>
            <textarea
              id="body"
              name="body"
              defaultValue={project?.body}
              rows={14}
              className={`${inputClase} font-mono`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Año" name="year" type="number" defaultValue={project?.year ?? ""} />
            <div>
              <label htmlFor="status" className="block text-sm text-gray-400 mb-1">Estado</label>
              <select
                id="status"
                name="status"
                defaultValue={project?.status ?? "live"}
                className={inputClase}
              >
                <option value="live">Live</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <Field label="Rol" name="role" defaultValue={project?.role} hint="Ej. Founder & full-stack developer" />
          <Field
            label="Stack (separado por coma)"
            name="stack"
            defaultValue={project?.stack?.join(", ")}
          />
          <Field label="Repo de GitHub (opcional)" name="repoUrl" type="url" defaultValue={project?.repoUrl} />
          <MediaUploader
            name="gallery"
            label="Galería (capturas)"
            kind="image"
            multiple
            initial={project?.gallery}
          />
          <MediaUploader name="video" label="Video de cómo funciona" kind="video" initial={project?.video} />
          <Field
            label="Pitch en YouTube (opcional)"
            name="pitch"
            type="url"
            defaultValue={project?.pitch}
            hint="Pega el link con el minuto donde empiezas (…&t=3852s)."
          />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured ?? false}
              className="w-4 h-4 accent-white"
            />
            Destacado (banner grande en Proyectos)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              name="heroVideo"
              defaultChecked={project?.heroVideo ?? false}
              className="w-4 h-4 accent-white"
            />
            Video arriba en vez de la portada (si no tiene imágenes reales)
          </label>
        </Seccion>

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
          <Link
            href="/admin/projects"
            className="border-2 border-gray-700 text-gray-300 hover:border-white hover:text-white px-6 py-2 text-sm transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
