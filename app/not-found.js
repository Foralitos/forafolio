import Link from "next/link";

// El 404 del Remix salía del mismo ErrorBoundary (throw new Response 404).
export default function NotFound() {
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
      <h1 style={{ fontSize: "1.5rem", margin: 0 }}>404 Not Found</h1>
      <p style={{ margin: 0, opacity: 0.7 }}>Esta página no existe.</p>
      <Link href="/" style={{ marginTop: "1rem", textDecoration: "underline" }}>
        Volver al inicio
      </Link>
    </main>
  );
}
