import Link from "next/link";
import { getAllProjects } from "@/models/Project";
import ConfirmSubmit from "../ConfirmSubmit";
import { deleteProject, toggleProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProjects() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-pixel text-xl tracking-wider">PROYECTOS</h1>
        <Link
          href="/admin/projects/new"
          className="border-2 border-white bg-white/10 hover:bg-white hover:text-gray-900 text-white px-4 py-2 text-sm transition-colors"
        >
          + Nuevo
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">Aún no hay proyectos. Crea el primero.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 border-2 border-gray-700 bg-gray-900 p-3"
            >
              <div className="w-16 h-12 border border-gray-700 bg-gray-800 overflow-hidden shrink-0">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-gray-500 text-xs truncate">
                  {p.tags.join(" · ")}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 border ${
                  p.published
                    ? "border-green-500/40 text-green-300"
                    : "border-gray-600 text-gray-500"
                }`}
              >
                {p.published ? "Publicado" : "Borrador"}
              </span>

              <form action={toggleProject.bind(null, p.id, p.published)}>
                <button
                  type="submit"
                  className="text-xs text-gray-300 hover:text-white border-2 border-gray-700 hover:border-white px-3 py-1 transition-colors"
                >
                  {p.published ? "Ocultar" : "Publicar"}
                </button>
              </form>

              <Link
                href={`/admin/projects/${p.id}`}
                className="text-xs text-gray-300 hover:text-white border-2 border-gray-700 hover:border-white px-3 py-1 transition-colors"
              >
                Editar
              </Link>

              <ConfirmSubmit
                action={deleteProject.bind(null, p.id)}
                message={`¿Borrar "${p.title}"?`}
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
