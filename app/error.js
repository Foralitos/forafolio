"use client";

// Equivalente al ErrorBoundary de root.tsx: mismos textos, mismos estilos
// inline (a propósito — si lo que falló fue el CSS, este error igual se ve).
export default function Error({ error, reset }) {
  const detalle =
    process.env.NODE_ENV !== "production" && error?.message
      ? error.message
      : "Ocurrió un error inesperado. Intenta de nuevo en un momento.";

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
      <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Algo se rompió</h1>
      <p style={{ margin: 0, opacity: 0.7 }}>{detalle}</p>
      <button
        type="button"
        onClick={reset}
        style={{
          marginTop: "1rem",
          textDecoration: "underline",
          background: "none",
          border: "none",
          font: "inherit",
          cursor: "pointer",
          color: "inherit",
        }}
      >
        Reintentar
      </button>
      {/* <a> y no <Link> a propósito: si lo que se rompió fue el bundle
          del cliente, una navegación de Next fallaría igual. Una recarga
          dura es la única salida confiable desde un error boundary. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/" style={{ textDecoration: "underline" }}>
        Volver al inicio
      </a>
    </main>
  );
}
