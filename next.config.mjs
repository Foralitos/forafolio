import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sin esto Turbopack infiere la raíz del workspace desde /Users/fora/yarn.lock
  // (un lockfile suelto en el home) y avisa en cada build.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    // Sin optimizador de Vercel: la cuota gratuita de transformaciones (5K/mes) se agoto.
    unoptimized: true,
    // Las portadas de proyectos y posts viven en Cloudinary; los avatares de
    // Google llegan por la sesión de NextAuth.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    // Vercel corta cualquier request body en 4.5 MB, así que el tope real de
    // una subida de imagen es menor al límite de 5 MB que tenía el Remix.
    // La Server Action valida el mismo número antes de mandar a Cloudinary.
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
