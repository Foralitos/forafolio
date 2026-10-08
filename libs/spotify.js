import "server-only";

// "Última canción" del Inicio. Spotify no da acceso permanente con un token
// fijo: con el refresh token (sacado una vez con `yarn spotify-auth`) se pide
// un access token de una hora y con él se lee lo que suena. Si no suena nada,
// se cae a la última canción escuchada.
//
// Sin las tres env vars devuelve null y la tarjeta simplemente no aparece.
const TOKEN_URL = "https://accounts.spotify.com/api/token";

function aCancion(track, isPlaying) {
  const imagenes = track.album?.images ?? [];
  return {
    title: track.name,
    artist: (track.artists ?? []).map((a) => a.name).join(", "),
    cover: (imagenes[1] ?? imagenes[0])?.url ?? null,
    url: track.external_urls?.spotify ?? null,
    isPlaying,
  };
}

export async function getNowPlaying() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null;

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }),
    cache: "no-store",
  });
  if (!tokenRes.ok) return null;
  const { access_token } = await tokenRes.json();
  const headers = { Authorization: `Bearer ${access_token}` };

  // 200 con canción = está sonando algo; 204 = nada.
  const ahora = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers,
    cache: "no-store",
  });
  if (ahora.status === 200) {
    const data = await ahora.json();
    if (data?.item && data.currently_playing_type === "track") return aCancion(data.item, data.is_playing);
  }

  const recientes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
    headers,
    cache: "no-store",
  });
  if (!recientes.ok) return null;
  const track = (await recientes.json())?.items?.[0]?.track;
  return track ? aCancion(track, false) : null;
}
