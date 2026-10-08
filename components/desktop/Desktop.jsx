"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCDMXTime } from "@/hooks/useCDMXTime";
import { Wallpaper } from "./Wallpaper";
import { MenuBar } from "./MenuBar";
import { DesktopIcons } from "./DesktopIcon";
import { Dock } from "./Dock";
import { useMarquee } from "./useMarquee";

const DesktopContext = createContext({
  windowOpen: true,
  openWindow: () => {},
  closeWindow: () => {},
  selectedIcons: new Set(),
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
  const { box, selected, handlers } = useMarquee(areaRef);

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
          className="absolute inset-x-0 bottom-0 top-8 select-none"
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
        </div>
        <Dock />
      </div>
    </DesktopContext.Provider>
  );
}
