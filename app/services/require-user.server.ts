import { redirect } from "@remix-run/node";
import { getSession, type SessionUser } from "~/services/session.server";

/** Devuelve el user de la sesión o redirige a /login si no hay. */
export async function requireUser(request: Request): Promise<SessionUser> {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) throw redirect("/login");
  return user;
}

/** Devuelve el user si existe, o null (sin redirigir). */
export async function getOptionalUser(
  request: Request
): Promise<SessionUser | null> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("user") ?? null;
}
