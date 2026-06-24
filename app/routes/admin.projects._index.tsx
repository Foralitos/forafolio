import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/require-user.server";
import { connectDB } from "~/lib/db.server";
import { Project, getAllProjects } from "~/models/project.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  return json({ projects: await getAllProjects() });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireUser(request);
  const form = await request.formData();
  const intent = form.get("intent");
  const id = String(form.get("id") ?? "");

  await connectDB();

  if (intent === "delete") {
    await Project.findByIdAndDelete(id);
  } else if (intent === "toggle") {
    const published = form.get("published") === "true";
    await Project.findByIdAndUpdate(id, { published: !published });
  }

  return json({ ok: true });
}

export default function AdminProjects() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-pixel text-xl tracking-wider">PROYECTOS</h1>
        <Link
          to="/admin/projects/new"
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

              <Form method="post">
                <input type="hidden" name="id" value={p.id} />
                <input
                  type="hidden"
                  name="published"
                  value={String(p.published)}
                />
                <button
                  name="intent"
                  value="toggle"
                  className="text-xs text-gray-300 hover:text-white border-2 border-gray-700 hover:border-white px-3 py-1 transition-colors"
                >
                  {p.published ? "Ocultar" : "Publicar"}
                </button>
              </Form>

              <Link
                to={`/admin/projects/${p.id}`}
                className="text-xs text-gray-300 hover:text-white border-2 border-gray-700 hover:border-white px-3 py-1 transition-colors"
              >
                Editar
              </Link>

              <Form
                method="post"
                onSubmit={(e) => {
                  if (!confirm(`¿Borrar "${p.title}"?`)) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={p.id} />
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
