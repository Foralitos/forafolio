import { marked } from "marked";
import { sanitize } from "isomorphic-dompurify";

marked.setOptions({ gfm: true, breaks: true });

/** Convierte markdown a HTML sanitizado, seguro para dangerouslySetInnerHTML. */
export function renderMarkdown(md: string): string {
  const rawHtml = marked.parse(md ?? "", { async: false }) as string;
  return sanitize(rawHtml);
}
