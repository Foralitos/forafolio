"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDesktop } from "./Desktop";
import { APPS } from "./apps";
import { CELL_H, CELL_W, MARGIN, moverIconos, useIconLayout } from "./useIconLayout";

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
      <a href={app.href} target="_blank" rel="noopener noreferrer" aria-label={app.label} draggable={false} {...comunes} className={clase}>
        {contenido}
      </a>
    );
  }

  return (
    <Link href={app.href} onClick={openWindow} aria-label={app.label} draggable={false} {...comunes} className={clase}>
      {contenido}
    </Link>
  );
}

// Los íconos del escritorio (solo md+; en celular está el Dock). Cada uno vive
// en su celda de la cuadrícula (useIconLayout) y se puede arrastrar: si el que
// agarras está dentro de una selección del cuadro azul, se mueve todo el
// grupo. Al soltar se alinean a la cuadrícula y el acomodo se guarda en el
// navegador del visitante.
export function DesktopIcons() {
  const layout = useIconLayout();
  const { areaRef, selectedIcons, selectIcons } = useDesktop();
  const [arrastre, setArrastre] = useState(null); // { ids, dx, dy }
  const origen = useRef(null);
  const recienArrastrado = useRef(false);

  const onPointerDown = (e, id) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    origen.current = { x: e.clientX, y: e.clientY, id, capturado: false };
  };

  const onPointerMove = (e) => {
    const o = origen.current;
    if (!o) return;
    const dx = e.clientX - o.x;
    const dy = e.clientY - o.y;
    if (!o.capturado) {
      // Umbral de 4 px: menos que eso es un clic, no un arrastre.
      if (Math.hypot(dx, dy) < 4) return;
      // La captura se pide hasta aquí: si se pidiera en pointerdown, el clic
      // normal caería en el contenedor y el link nunca se abriría.
      e.currentTarget.setPointerCapture(e.pointerId);
      o.capturado = true;
      const enGrupo = selectedIcons.has(o.id) && selectedIcons.size > 1;
      o.ids = enGrupo ? [...selectedIcons] : [o.id];
      if (!enGrupo) selectIcons(new Set([o.id]));
    }
    setArrastre({ ids: o.ids, dx, dy });
  };

  const onPointerUp = (e) => {
    const o = origen.current;
    origen.current = null;
    if (!o?.capturado) return;
    const area = areaRef.current.getBoundingClientRect();
    moverIconos(o.ids, e.clientX - o.x, e.clientY - o.y, area.width, area.height);
    setArrastre(null);
    // El navegador dispara un click al soltar: ese no debe abrir nada.
    recienArrastrado.current = true;
    setTimeout(() => (recienArrastrado.current = false), 0);
  };

  const onClickCapture = (e) => {
    if (recienArrastrado.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="hidden md:block">
      {APPS.filter((app) => app.side).map((app) => {
        const celda = layout[app.id];
        const moviendo = arrastre?.ids.includes(app.id);
        const lado = celda.anchor === "left" ? { left: MARGIN + celda.col * CELL_W } : { right: MARGIN + celda.col * CELL_W };
        return (
          <div
            key={app.id}
            onPointerDown={(e) => onPointerDown(e, app.id)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClickCapture={onClickCapture}
            onDragStart={(e) => e.preventDefault()}
            className={`absolute flex justify-center ${moviendo ? "z-[25] opacity-[0.85]" : "z-10 transition-[left,right,top] duration-300 ease-out"}`}
            style={{
              ...lado,
              top: celda.row * CELL_H,
              width: CELL_W,
              transform: moviendo ? `translate(${arrastre.dx}px, ${arrastre.dy}px)` : undefined,
            }}
          >
            <DesktopIcon app={app} />
          </div>
        );
      })}
    </div>
  );
}
