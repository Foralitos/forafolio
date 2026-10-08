// Genera un slug url-safe a partir de un título. Lo usan los posts del blog y
// los proyectos (sin "server-only": no toca nada del servidor).
export function slugify(input) {
  return String(input ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
