import config from "@/config";

// Metadata por default para todas las páginas; cada ruta puede sobrescribir lo
// que necesite. Viene de ShipFast, podado a lo que este sitio usa (fuera el
// JSON-LD de SoftwareApplication, que describía un SaaS con precios).
export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
} = {}) => {
  return {
    title: title || config.appName,
    description: description || config.appDescription,
    keywords: keywords || [config.appName],
    applicationName: config.appName,
    // Convierte cualquier URL relativa (og:image, canonical) en absoluta.
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : `https://${config.domainName}/`
    ),
    openGraph: {
      title: openGraph?.title || title || config.appName,
      description: openGraph?.description || description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: config.appName,
      ...(openGraph?.images && { images: openGraph.images }),
      ...(openGraph?.type && { type: openGraph.type }),
      locale: "es_MX",
      type: openGraph?.type || "website",
    },
    twitter: {
      title: openGraph?.title || title || config.appName,
      description: openGraph?.description || description || config.appDescription,
      card: "summary_large_image",
      creator: "@ElforaDev",
      ...(openGraph?.images && { images: openGraph.images }),
    },
    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),
    ...extraTags,
  };
};
