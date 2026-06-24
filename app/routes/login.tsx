import type {
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getOptionalUser } from "~/services/require-user.server";

export const meta: MetaFunction = () => [{ title: "Login — Fora" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getOptionalUser(request);
  if (user) throw redirect("/admin");

  const url = new URL(request.url);
  return json({ error: url.searchParams.get("error") });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();

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

            {error === "unauthorized" && (
              <p className="text-red-400 text-xs mb-6 border-2 border-red-500/50 bg-red-500/10 px-3 py-2">
                ⚠ Esa cuenta no tiene acceso.
              </p>
            )}

            <Form method="post" action="/auth/google" className="w-full">
              <button
                type="submit"
                className="w-full border-2 border-white bg-white/10 hover:bg-white hover:text-gray-900 text-white text-center py-3 transition-colors duration-200"
              >
                <span className="font-pixel text-xs">▶ SIGN IN WITH GOOGLE</span>
              </button>
            </Form>
          </div>

          {/* Corner decorations */}
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white" />
        </div>

        <a
          href="/"
          className="block text-center text-gray-500 hover:text-white text-xs mt-6 transition-colors"
        >
          ← Volver al sitio
        </a>
      </div>
    </main>
  );
}
