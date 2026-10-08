"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDesktop } from "./Desktop";
import { APPS } from "./apps";

// Un ícono del escritorio en el modo "Clear" de macOS Tahoe: squircle de
// vidrio con el glifo en blanco + etiqueta con sombra. El seleccionado solo
// ilumina su squircle; la etiqueta no cambia.
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

  const { Icon } = app;

  const contenido = (
    <>
      <span
        className={`flex items-center justify-center bg-white/20 backdrop-blur-md backdrop-saturate-150 transition-all duration-200 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.6),inset_0_0_0_1px_rgba(255,255,255,0.35),0_8px_20px_-6px_rgba(0,0,0,0.35)] group-hover:bg-white/30 group-active:scale-95 ${
          compact ? "h-11 w-11 rounded-[12px]" : "h-14 w-14 rounded-[15px]"
        } ${selected ? "bg-white/40" : ""}`}
      >
        <Icon
          size={compact ? 24 : 30}
          weight="duotone"
          className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        />
      </span>
      {!compact && (
        <span className="mt-1.5 px-1.5 py-px text-center text-xs font-medium leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
          {app.label}
        </span>
      )}
    </>
  );

  const comunes = { "data-desktop-icon": compact ? undefined : app.id };

  const clase = `group flex flex-col items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
    compact ? "p-1" : "w-24 p-1.5"
  }`;

  if (!app.href) {
    return (
      <button type="button" title="Empty (for now)" {...comunes} className={`${clase} cursor-default`}>
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
          className={`absolute top-0 hidden flex-col gap-3 md:flex ${
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
