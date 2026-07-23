import { vitePlugin as remix } from "@remix-run/dev";
import { vercelPreset } from "@vercel/remix/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    // sanitize-html es CJS y hace require() de htmlparser2 v12 (ESM-only);
    // el runtime de Vercel no soporta require(esm), así que bundleamos toda
    // la cadena en el server bundle con las versiones exactas que sanitize-html
    // espera (hay un htmlparser2 v10 hoisted en el root que NO es el suyo).
    noExternal: [
      "sanitize-html",
      "htmlparser2",
      "domhandler",
      "domutils",
      "dom-serializer",
      "domelementtype",
      "entities",
      "parse-srcset",
      "is-plain-object",
      "deepmerge",
      "escape-string-regexp",
      "launder",
    ],
  },
  plugins: [
    remix({
      presets: [vercelPreset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
});
