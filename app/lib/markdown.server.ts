import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: true });

// sanitize-html es puro JS (htmlparser2), sin jsdom: isomorphic-dompurify
// cargaba jsdom en cada cold start y tronaba la función en Vercel
// (ERR_REQUIRE_ESM en html-encoding-sniffer).
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "loading"],
    a: ["href", "title", "target", "rel"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

/** Convierte markdown a HTML sanitizado, seguro para dangerouslySetInnerHTML. */
export function renderMarkdown(md: string): string {
  const rawHtml = marked.parse(md ?? "", { async: false }) as string;
  return sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
}
