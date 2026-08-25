import config from "@/config";
import { getPublishedPosts } from "@/models/Post";

const BASE = `https://${config.domainName}`;

// Sustituye a next-sitemap del boilerplate. Solo se anuncian los posts
// publicados; los borradores ni siquiera tienen ruta pública.
export default async function sitemap() {
  let posts = [];
  try {
    posts = await getPublishedPosts();
  } catch (err) {
    // Un sitemap sin artículos es mejor que un build caído por Mongo.
    console.error("[sitemap] No se pudieron cargar posts:", err);
  }

  return [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/blog`, priority: 0.8 },
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      priority: 0.6,
      ...(p.updatedAt && { lastModified: new Date(p.updatedAt) }),
    })),
  ];
}
