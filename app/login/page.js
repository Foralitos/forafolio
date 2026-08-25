import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/libs/auth";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import LoginForm from "./LoginForm";

export const metadata = getSEOTags({
  title: "Login — Fora",
  extraTags: { robots: { index: false, follow: false } },
});

export default async function LoginPage({ searchParams }) {
  const session = await auth();
  if (session?.user) redirect(config.auth.callbackUrl);

  // En Next 16 searchParams llega como promesa.
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,rgba(99,102,241,0)_100%)]" />

      <div className="relative w-full max-w-md">
        {/* Pixel-art card */}
        <div className="relative bg-gray-900/95 backdrop-blur-sm border-4 border-white shadow-2xl">
          <div className="border-2 border-gray-700 p-8 flex flex-col items-center text-center">
            <h1 className="font-pixel text-white text-lg mb-2 tracking-wider">
              ADMIN
            </h1>
            <div className="w-24 h-1 bg-white mb-6" />
            <p className="text-gray-400 text-sm mb-8">
              Acceso restringido. Entra con tu cuenta de Google.
            </p>

            {/* NextAuth manda AccessDenied cuando el callback signIn rechaza;
                el "unauthorized" es el valor que usaba el flujo viejo de Remix
                y se conserva por si queda un link o un bookmark con esa URL. */}
            {(error === "AccessDenied" || error === "unauthorized") && (
              <p className="text-red-400 text-xs mb-6 border-2 border-red-500/50 bg-red-500/10 px-3 py-2">
                ⚠ Esa cuenta no tiene acceso.
              </p>
            )}

            <LoginForm />
          </div>

          {/* Corner decorations */}
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white" />
        </div>

        <Link
          href="/"
          className="block text-center text-gray-500 hover:text-white text-xs mt-6 transition-colors"
        >
          ← Volver al sitio
        </Link>
      </div>
    </main>
  );
}
