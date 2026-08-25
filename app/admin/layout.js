import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/libs/auth";
import config from "@/config";
import AdminNav from "./AdminNav";
import LogoutButton from "./LogoutButton";

export const metadata = {
  title: "Dashboard — Fora",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  // Guard de todo /admin/*. Ojo: NO cubre las Server Actions, que son
  // endpoints propios — cada una revalida la sesión por su cuenta.
  const session = await auth();
  if (!session?.user) redirect(config.auth.loginUrl);

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-white bg-gray-900 flex flex-col">
        <div className="p-6 border-b-2 border-gray-700">
          <Link href="/admin" className="font-pixel text-sm tracking-wider">
            FORA · ADMIN
          </Link>
        </div>

        <AdminNav />

        <div className="p-4 border-t-2 border-gray-700 space-y-3">
          <div className="flex items-center gap-2">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                className="w-8 h-8 rounded-full border border-gray-600"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <span className="text-xs text-gray-400 truncate">{user.email}</span>
          </div>
          <Link
            href="/"
            className="block text-center text-xs text-gray-400 hover:text-white border-2 border-gray-700 hover:border-white py-2 transition-colors"
          >
            Ver sitio →
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
