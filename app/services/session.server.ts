import { createCookieSessionStorage } from "@remix-run/node";

export type SessionUser = {
  email: string;
  name: string;
  picture?: string;
};

type SessionData = { user: SessionUser };
type SessionFlashData = { error: string };

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET no está definida en las variables de entorno");
}

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__forafolio_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
