"use client";

import { useRef, useState } from "react";

// El cuadro de selección de Finder: clic sobre el escritorio vacío y arrastrar
// dibuja un rectángulo; los íconos que toca quedan seleccionados. Solo con
// mouse (en touch, arrastrar es hacer scroll).
//
// Los íconos se encuentran por su atributo data-desktop-icon, así que no hace
// falta registrar refs por cada uno.
export function useMarquee(areaRef) {
  const [box, setBox] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const origen = useRef(null);

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    // Solo desde el fondo: sobre un ícono, un link o la ventana manda su
    // propio clic.
    if (e.target.closest("a, button, section")) return;

    const area = areaRef.current.getBoundingClientRect();
    origen.current = { x: e.clientX - area.left, y: e.clientY - area.top };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault(); // que no seleccione texto mientras arrastra
    setSelected(new Set());
  };

  const onPointerMove = (e) => {
    if (!origen.current) return;
    const area = areaRef.current.getBoundingClientRect();
    const x = e.clientX - area.left;
    const y = e.clientY - area.top;
    const rect = {
      left: Math.min(origen.current.x, x),
      top: Math.min(origen.current.y, y),
      width: Math.abs(x - origen.current.x),
      height: Math.abs(y - origen.current.y),
    };
    setBox(rect);

    const tocados = new Set();
    areaRef.current.querySelectorAll("[data-desktop-icon]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const ix = r.left - area.left;
      const iy = r.top - area.top;
      const intersecta =
        ix < rect.left + rect.width &&
        ix + r.width > rect.left &&
        iy < rect.top + rect.height &&
        iy + r.height > rect.top;
      if (intersecta) tocados.add(el.dataset.desktopIcon);
    });
    setSelected(tocados);
  };

  const onPointerUp = () => {
    origen.current = null;
    setBox(null);
  };

  return {
    box,
    selected,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
