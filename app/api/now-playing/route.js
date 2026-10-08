import { getNowPlaying } from "@/libs/spotify";

// La respuesta se cachea 30 s: aunque muchos visitantes abran el Inicio a la
// vez, a Spotify le pegamos como mucho dos veces por minuto.
export const revalidate = 30;

export async function GET() {
  try {
    return Response.json(await getNowPlaying());
  } catch (err) {
    console.error("[now-playing] Spotify falló:", err);
    return Response.json(null);
  }
}
