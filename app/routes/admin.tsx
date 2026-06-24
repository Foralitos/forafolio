import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import { requireUser } from "~/services/require-user.server";

export const meta: MetaFunction = () => [
  { title: "Dashboard — Fora" },
  { name: "robots", content: "noindex" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  return json({ user });
}

const navItems = [
  { to: "/admin", label: "Inicio", end: true },
  { to: "/admin/projects", label: "Proyectos", end: false },
  { to: "/admin/blog", label: "Blog", end: false },
];

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-white bg-gray-900 flex flex-col">
        <div className="p-6 border-b-2 border-gray-700">
          <Link to="/admin" className="font-pixel text-sm tracking-wider">
            FORA · ADMIN
          </Link>
        </div>

        <nav className="flex md:flex-col p-4 gap-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-4 py-2 border-2 text-sm transition-colors ${
                  isActive
                    ? "border-white bg-white text-gray-900"
                    : "border-gray-700 text-gray-300 hover:border-white hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-gray-700 space-y-3">
          <div className="flex items-center gap-2">
            {user.picture ? (
              <img
                src={user.picture}
                alt=""
                className="w-8 h-8 rounded-full border border-gray-600"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <span className="text-xs text-gray-400 truncate">{user.email}</span>
          </div>
          <a
            href="/"
            className="block text-center text-xs text-gray-400 hover:text-white border-2 border-gray-700 hover:border-white py-2 transition-colors"
          >
            Ver sitio →
          </a>
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="w-full text-center text-xs text-red-300 hover:text-white border-2 border-red-500/40 hover:border-red-400 hover:bg-red-500/10 py-2 transition-colors"
            >
              Cerrar sesión
            </button>
          </Form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
