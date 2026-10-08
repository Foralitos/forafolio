"use client";

import ReactDOM from "react-dom";

const DIA = "/ForaDay.png";
const NOCHE = "/ForaNight.png";

// Los dos fondos van apilados y se cruzan por opacidad: cuando el reloj de
// CDMX pasa de las 6:00 o de las 18:00, el día se funde con la noche en vez de
// cambiar de golpe.
export function Wallpaper({ isDaytime }) {
  ReactDOM.preload(DIA, { as: "image" });
  ReactDOM.preload(NOCHE, { as: "image" });

  return (
    <div className="absolute inset-0" aria-hidden>
      {[
        { src: DIA, visible: isDaytime },
        { src: NOCHE, visible: !isDaytime },
      ].map(({ src, visible }) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${src})`, imageRendering: "pixelated" }}
        />
      ))}
      {/* Velo ligero para que las etiquetas de los íconos se lean sobre
          cualquier parte de la escena. */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}
