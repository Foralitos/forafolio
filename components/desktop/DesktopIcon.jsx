"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDesktop } from "./Desktop";
import { APPS } from "./apps";

// Un ícono del escritorio: dibujo 3D + etiqueta blanca con sombra, como en
// Finder. El de la ruta abierta queda marcado.
export function DesktopIcon({ app, compact = false }) {
  const pathname = usePathname();
  const { windowOpen, openWindow, selectedIcons } = useDesktop();
  // Si hay una selección hecha con el cuadro azul, esa manda; si no, se marca
  // el ícono de la ventana abierta.
  const selected =
    !compact &&
    (selectedIcons.size > 0
      ? selectedIcons.has(app.id)
      : windowOpen && app.href === pathname);

  const contenido = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={app.icon}
        alt=""
        draggable={false}
        className={`${compact ? "h-10 w-10" : "h-14 w-14"} drop-shadow-md transition-transform duration-200 group-hover:scale-105 group-active:scale-95`}
      />
      {!compact && (
        <span
          className={`mt-1 rounded px-1.5 py-px text-center text-xs font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] ${
            selected ? "bg-blue-600/90 [text-shadow:none]" : ""
          }`}
        >
          {app.label}
        </span>
      )}
    </>
  );

  const comunes = { "data-desktop-icon": compact ? undefined : app.id };

  const clase = `group flex w-24 flex-col items-center rounded-lg p-2 outline-none focus-visible:bg-white/20 ${
    selected ? "bg-white/15" : ""
  } ${compact ? "w-auto p-1" : ""}`;

  if (!app.href) {
    return (
      <button type="button" title="Vacía (por ahora)" {...comunes} className={`${clase} cursor-default`}>
        {contenido}
      </button>
    );
  }

  if (app.external) {
    return (
      <a href={app.href} target="_blank" rel="noopener noreferrer" aria-label={app.label} {...comunes} className={clase}>
        {contenido}
      </a>
    );
  }

  return (
    <Link href={app.href} onClick={openWindow} aria-label={app.label} {...comunes} className={clase}>
      {contenido}
    </Link>
  );
}

// Las dos columnas a los lados de la ventana, solo en pantallas md+.
export function DesktopIcons() {
  return (
    <>
      {["left", "right"].map((side) => (
        <nav
          key={side}
          className={`absolute top-3 hidden flex-col gap-2 md:flex ${
            side === "left" ? "left-3" : "right-3"
          }`}
        >
          {APPS.filter((app) => app.side === side).map((app) => (
            <DesktopIcon key={app.id} app={app} />
          ))}
        </nav>
      ))}
    </>
  );
}
