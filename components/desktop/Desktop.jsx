"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCDMXTime } from "@/hooks/useCDMXTime";
import { Wallpaper } from "./Wallpaper";
import { MenuBar } from "./MenuBar";
import { DesktopIcons } from "./DesktopIcon";
import { Dock } from "./Dock";
import { useMarquee } from "./useMarquee";
import { ContextMenu } from "./ContextMenu";
import { limpiar } from "./useIconLayout";

const DesktopContext = createContext({
  windowOpen: true,
  openWindow: () => {},
  closeWindow: () => {},
  selectedIcons: new Set(),
  selectIcons: () => {},
  areaRef: { current: null },
});

export const useDesktop = () => useContext(DesktopContext);

// El escritorio completo. Vive en app/(desktop)/layout.js, así que NO se vuelve
// a montar al navegar: solo cambia la ventana (cada page.js trae la suya).
//
// Cerrar la ventana no cambia la URL: es estado de este contexto. Abrir otra
// ruta, o volver a dar clic al ícono de la actual, la vuelve a abrir.
export default function Desktop({ children }) {
  const { isDaytime } = useCDMXTime();
  const pathname = usePathname();
  const areaRef = useRef(null);
  const [closedAt, setClosedAt] = useState(null);

  // "Cerrada" se guarda junto con la ruta en la que se cerró: al cambiar de
  // ruta deja de coincidir y la ventana nueva aparece abierta, sin un efecto
  // que haga setState (React 19 lo marca como error).
  const windowOpen = closedAt !== pathname;
  const { box, selected, setSelected, handlers } = useMarquee(areaRef);
  const [menu, setMenu] = useState(null); // { x, y } del clic derecho
  const cerrarMenu = useCallback(() => setMenu(null), []);

  // Clic derecho sobre el escritorio vacío (no sobre la ventana ni un ícono).
  const onContextMenu = (e) => {
    if (e.target.closest("a, button, section")) return;
    e.preventDefault();
    const area = areaRef.current.getBoundingClientRect();
    setMenu({
      x: Math.min(e.clientX - area.left, area.width - 190),
      y: Math.min(e.clientY - area.top, area.height - 90),
    });
  };

  const tamañoArea = () => {
    const area = areaRef.current.getBoundingClientRect();
    return [area.width, area.height];
  };
  const itemsMenu = [
    { label: "Clean Up", onSelect: () => limpiar(null, ...tamañoArea()) },
    ...(selected.size > 0
      ? [{ label: "Clean Up Selection", onSelect: () => limpiar([...selected], ...tamañoArea()) }]
      : []),
  ];

  // Con la ventana cerrada, Escape no hace nada; abierta, la cierra como ⌘W.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setClosedAt(pathname);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname]);

  const value = {
    windowOpen,
    openWindow: () => setClosedAt(null),
    closeWindow: () => setClosedAt(pathname),
    selectedIcons: selected,
    selectIcons: setSelected,
    areaRef,
  };

  return (
    <DesktopContext.Provider value={value}>
      <div
        data-theme={isDaytime ? "day" : "night"}
        className="fixed inset-0 overflow-hidden font-sans text-desk-fg antialiased"
      >
        <Wallpaper isDaytime={isDaytime} />
        <MenuBar />
        {/* Área útil debajo de la barra de menú: aquí viven los íconos y la
            ventana, y es el lienzo del cuadro de selección. */}
        <div
          ref={areaRef}
          {...handlers}
          onContextMenu={onContextMenu}
          className="absolute inset-x-0 bottom-0 top-14 select-none md:top-16"
        >
          <DesktopIcons />
          {children}
          {box && (
            <div
              aria-hidden
              className="pointer-events-none absolute z-20 rounded-sm border border-blue-400/90 bg-blue-500/20"
              style={box}
            />
          )}
          {menu && <ContextMenu x={menu.x} y={menu.y} items={itemsMenu} onClose={cerrarMenu} />}
        </div>
        <Dock />
      </div>
    </DesktopContext.Provider>
  );
}
