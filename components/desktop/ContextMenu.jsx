"use client";

import { useEffect, useRef } from "react";

// Menú de clic derecho del escritorio, de vidrio como los de macOS. Se cierra
// con clic fuera o con Escape (escuchado en captura para que Escape no cierre
// también la ventana, que el escritorio cierra con esa tecla).
export function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const fuera = (e) => {
      if (!ref.current?.contains(e.target)) onClose();
    };
    const tecla = (e) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("pointerdown", fuera, true);
    window.addEventListener("keydown", tecla, true);
    return () => {
      window.removeEventListener("pointerdown", fuera, true);
      window.removeEventListener("keydown", tecla, true);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      className="glass glass-float absolute z-50 min-w-44 rounded-xl p-1 text-[13px]"
      style={{ left: x, top: y }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          onClick={() => {
            item.onSelect();
            onClose();
          }}
          className="block w-full rounded-md px-3 py-1.5 text-left hover:bg-blue-500 hover:text-white"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
