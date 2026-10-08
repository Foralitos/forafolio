"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft } from "phosphor-react";
import { useDesktop } from "./Desktop";

// La ventana estilo macOS. Cada page.js del grupo (desktop) envuelve su
// contenido en una; al navegar, la página nueva trae una ventana nueva y la
// animación de apertura corre sola.
//
// - Rojo y amarillo cierran (no hay multi-ventana todavía, así que minimizar
//   y cerrar son lo mismo). Verde maximiza/restaura.
// - No se arrastra: siempre aparece centrada.
// - El scroll vive dentro del cuerpo: el escritorio nunca hace scroll.
// - backHref (opcional) pone una flecha ‹ junto a los semáforos para volver
//   de una página interna (un post, un proyecto) a su lista.
// - toolbar (opcional) va fijo debajo del título, fuera del scroll y sin
//   fondo propio: comparte el vidrio de la ventana (un backdrop-filter anidado
//   se ve como una franja más clara).
export function Window({ title, children, bodyClassName = "", backHref, toolbar }) {
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
          className={`glass glass-float absolute z-30 flex flex-col overflow-hidden transition-[inset,border-radius,background-color] duration-300 ${
            maximized
              ? "inset-0 rounded-none"
              : "inset-x-2 bottom-20 top-0 rounded-2xl md:inset-x-32 md:bottom-6 lg:mx-auto lg:max-w-5xl"
          }`}
        >
          {/* Barra de título */}
          <div
            onDoubleClick={toggleMaximize}
            className="relative flex h-11 shrink-0 select-none items-center border-b border-desk-line/[0.06] px-4"
          >
            <div className="group/lights flex items-center gap-2">
              <Semaforo color="bg-[#ff5f57]" label="Close" simbolo="×" onClick={closeWindow} />
              <Semaforo color="bg-[#febc2e]" label="Minimize" simbolo="−" onClick={closeWindow} />
              <Semaforo
                color="bg-[#28c840]"
                label={maximized ? "Restore" : "Maximize"}
                simbolo="+"
                onClick={toggleMaximize}
              />
            </div>
            {backHref && (
              <Link
                href={backHref}
                aria-label="Back"
                className="relative z-10 ml-4 flex h-7 w-7 items-center justify-center rounded-lg text-desk-fg/60 hover:bg-desk-line/10 hover:text-desk-fg"
              >
                <CaretLeft size={16} weight="bold" />
              </Link>
            )}
            <h2 className="pointer-events-none absolute inset-x-0 truncate px-28 text-center text-[13px] font-semibold text-desk-fg/70">
              {title}
            </h2>
          </div>

          {toolbar && (
            <div className="shrink-0 border-b border-desk-line/[0.08] px-4 py-2.5">{toolbar}</div>
          )}

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
