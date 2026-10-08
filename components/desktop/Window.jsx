"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDesktop } from "./Desktop";

// La ventana estilo macOS. Cada page.js del grupo (desktop) envuelve su
// contenido en una; al navegar, la página nueva trae una ventana nueva y la
// animación de apertura corre sola.
//
// - Rojo y amarillo cierran (no hay multi-ventana todavía, así que minimizar
//   y cerrar son lo mismo). Verde maximiza/restaura.
// - No se arrastra: siempre aparece centrada.
// - El scroll vive dentro del cuerpo: el escritorio nunca hace scroll.
export function Window({ title, children, bodyClassName = "" }) {
  const { windowOpen, closeWindow } = useDesktop();
  const [maximized, setMaximized] = useState(false);
  const toggleMaximize = () => setMaximized((m) => !m);

  return (
    <AnimatePresence>
      {windowOpen && (
        <motion.section
          key="window"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute z-30 flex flex-col overflow-hidden border border-desk-line/10 bg-desk-win/95 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-[inset,border-radius,background-color] duration-300 ${
            maximized
              ? "inset-0 rounded-none"
              : "inset-x-2 bottom-20 top-2 rounded-xl md:inset-x-32 md:bottom-6 md:top-4 lg:mx-auto lg:max-w-5xl"
          }`}
        >
          {/* Barra de título */}
          <div
            onDoubleClick={toggleMaximize}
            className="relative flex h-10 shrink-0 select-none items-center border-b border-desk-line/10 bg-desk-chrome/80 px-4"
          >
            <div className="group/lights flex items-center gap-2">
              <Semaforo color="bg-[#ff5f57]" label="Cerrar" simbolo="×" onClick={closeWindow} />
              <Semaforo color="bg-[#febc2e]" label="Minimizar" simbolo="−" onClick={closeWindow} />
              <Semaforo
                color="bg-[#28c840]"
                label={maximized ? "Restaurar" : "Maximizar"}
                simbolo="+"
                onClick={toggleMaximize}
              />
            </div>
            <h2 className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold text-desk-muted">
              {title}
            </h2>
          </div>

          {/* Cuerpo */}
          <div className={`relative flex-1 overflow-y-auto overscroll-contain ${bodyClassName}`}>
            {children}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

// Los símbolos aparecen al pasar el mouse por el grupo, igual que en macOS.
function Semaforo({ color, label, simbolo, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-3 w-3 items-center justify-center rounded-full ${color} text-[10px] font-bold leading-none text-black/60 ring-1 ring-black/10`}
    >
      <span className="opacity-0 group-hover/lights:opacity-100">{simbolo}</span>
    </button>
  );
}
