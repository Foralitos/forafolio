// El campo `video` de un proyecto puede ser un archivo (Cloudinary) o un link
// de YouTube, por ejemplo un pitch grabado en un evento. Para YouTube se
// devuelve la URL de embed respetando el minuto de inicio (?t=).
export function youtubeEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id = null;
    if (u.hostname.endsWith("youtu.be")) id = u.pathname.slice(1);
    else if (u.hostname.includes("youtube.com")) id = u.searchParams.get("v");
    if (!id) return null;
    const inicio = parseInt(u.searchParams.get("t") ?? u.searchParams.get("start") ?? "0", 10);
    return `https://www.youtube.com/embed/${id}?rel=0${inicio > 0 ? `&start=${inicio}` : ""}`;
  } catch {
    return null;
  }
}
