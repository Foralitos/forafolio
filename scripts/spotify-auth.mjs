// Saca el refresh token de Spotify UNA vez. Ejecutar con:
//   yarn spotify-auth
// Antes: crear una app en https://developer.spotify.com/dashboard con el
// Redirect URI http://127.0.0.1:8888/callback y poner SPOTIFY_CLIENT_ID y
// SPOTIFY_CLIENT_SECRET en .env. El script abre el navegador para autorizar
// y al volver imprime SPOTIFY_REFRESH_TOKEN para pegarlo en .env y en Vercel.
import http from "node:http";
import { exec } from "node:child_process";

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error("Faltan SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET en .env");
  process.exit(1);
}

const REDIRECT = "http://127.0.0.1:8888/callback";
const SCOPES = "user-read-currently-playing user-read-recently-played";
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({ client_id: id, response_type: "code", redirect_uri: REDIRECT, scope: SCOPES });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== "/callback") return res.end();
  const code = url.searchParams.get("code");
  if (!code) {
    res.end("Sin código: ¿cancelaste la autorización?");
    return;
  }
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT }),
  });
  const data = await tokenRes.json();
  if (!data.refresh_token) {
    res.end("Spotify no devolvió refresh token. Revisa la consola.");
    console.error(data);
  } else {
    res.end("Listo. Ya puedes cerrar esta pestaña y volver a la terminal.");
    console.log("\nAgrega esto a .env y a las env vars de Vercel:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => {
  console.log("Abriendo Spotify para autorizar…");
  exec(`open "${authUrl}"`);
});
