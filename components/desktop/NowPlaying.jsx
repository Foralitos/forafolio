"use client";

import { useEffect, useState } from "react";
import { SpotifyLogo } from "phosphor-react";

// Tarjeta de "última canción" del Inicio. Lee /api/now-playing (cacheado 30 s
// en el servidor) al montar y cada minuto. Si Spotify no está configurado o
// falla, la ruta devuelve null y la tarjeta no se dibuja.
export function NowPlaying() {
  const [cancion, setCancion] = useState(null);

  useEffect(() => {
    let vivo = true;
    const cargar = () =>
      fetch("/api/now-playing")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => vivo && setCancion(data))
        .catch(() => {});
    cargar();
    const intervalo = setInterval(cargar, 60_000);
    return () => {
      vivo = false;
      clearInterval(intervalo);
    };
  }, []);

  if (!cancion) return null;

  return (
    <a
      href={cancion.url ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="panel group flex items-center gap-4 rounded-2xl p-4 transition-transform duration-200 hover:-translate-y-0.5"
    >
      {cancion.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cancion.cover} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover shadow-md" />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[12px] text-desk-fg/50">
          {cancion.isPlaying ? (
            <>
              <span className="flex h-3 items-end gap-[2px]" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-[3px] origin-bottom animate-[eq_0.9s_ease-in-out_infinite] rounded-full bg-green-500"
                    style={{ height: "100%", animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
              now playing
            </>
          ) : (
            "last played"
          )}
        </p>
        <p className="mt-0.5 truncate text-[15px] font-semibold">{cancion.title}</p>
        <p className="truncate text-[13px] text-desk-fg/60">{cancion.artist}</p>
      </div>
      <SpotifyLogo size={20} weight="fill" className="shrink-0 text-[#1DB954]" />
    </a>
  );
}
