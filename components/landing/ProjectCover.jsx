"use client";

import { youtubeEmbed } from "@/libs/youtube";

// Portada de un proyecto: el video en loop si hay, si no la imagen, y si no
// hay ninguna (proyecto recién cargado, sin captura todavía) una portada
// provisional con degradado y el nombre, en vez de un hueco vacío. El color
// sale del título, así cada proyecto tiene el suyo y no cambia entre visitas.
export function tono(texto) {
  let h = 0;
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

export function ProjectCover({ project, className = "", autoPlay = true, titleClassName = "text-4xl" }) {
  // Un link de YouTube no sirve como portada en loop: ahí manda la imagen.
  if (project.video && autoPlay && !youtubeEmbed(project.video)) {
    return (
      <video
        src={project.video}
        poster={project.image || undefined}
        autoPlay
        muted
        loop
        playsInline
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  if (project.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={project.image} alt="" className={`h-full w-full object-cover ${className}`} />
    );
  }
  const h = tono(project.title);
  return (
    <div
      className={`flex h-full w-full items-center justify-center p-6 ${className}`}
      style={{
        background: `radial-gradient(circle at 25% 20%, hsl(${h} 80% 72%), transparent 60%), linear-gradient(135deg, hsl(${h} 65% 52%), hsl(${(h + 50) % 360} 60% 32%))`,
      }}
    >
      <span className={`text-center font-mondwest leading-none text-white/90 drop-shadow ${titleClassName}`}>
        {project.title}
      </span>
    </div>
  );
}
