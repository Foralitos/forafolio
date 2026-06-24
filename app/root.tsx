import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: "/fonts/ppneuebit-bold.otf",
    as: "font",
    type: "font/otf",
    crossOrigin: "anonymous"
  },
  {
    rel: "preload",
    href: "/fonts/ppmondwest-regular.otf",
    as: "font",
    type: "font/otf",
    crossOrigin: "anonymous"
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com"
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Algo se rompió";
  let detail = "Ocurrió un error inesperado. Intenta de nuevo en un momento.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    detail = typeof error.data === "string" ? error.data : detail;
  } else if (error instanceof Error && process.env.NODE_ENV !== "production") {
    detail = error.message;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "monospace",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", margin: 0 }}>{title}</h1>
      <p style={{ margin: 0, opacity: 0.7 }}>{detail}</p>
      <a href="/" style={{ marginTop: "1rem", textDecoration: "underline" }}>
        Volver al inicio
      </a>
    </main>
  );
}
