import config from "@/config";

// El admin y el login se excluyen con <meta robots noindex> en su propia
// metadata, no aquí: bloquearlos en robots.txt impediría que el crawler llegue
// a VER ese noindex.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${config.domainName}/sitemap.xml`,
  };
}
