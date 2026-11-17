"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft, SquaresFour } from "phosphor-react";
import { useDesktop } from "./Desktop";

// En desktop (md+): ventana estilo macOS con semáforos y doble clic para maximizar.
// En mobile (< md): App a pantalla completa estilo iPhone (iOS), con barra de
// navegación superior (< Home / < Back + botón Apps) y Home Bar inferior para
// volver al Home Screen del iPhone.
export function Window({ title, children, bodyClassName = "", backHref, toolbar }) {
  const { windowOpen, closeWindow } = useDesktop();
  const [maximized, setMaximized] = useState(false);
  const touchStartY = useRef(null);
  const toggleMaximize = () => setMaximized((m) => !m);

  const onHomeBarTouchStart = (e) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };

  const onHomeBarTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
    if (touchStartY.current - endY > 18) {
      closeWindow();
    }
    touchStartY.current = null;
  };

  return (
    <AnimatePresence>
      {windowOpen && (
        <motion.section
          key="window"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={`glass glass-float absolute flex flex-col overflow-hidden transition-[inset,border-radius,background-color] duration-300 ${
            maximized
              ? "inset-0 z-30 rounded-none"
              : "inset-x-0 bottom-0 top-0 z-40 rounded-t-[28px] md:inset-x-32 md:bottom-6 md:z-30 md:rounded-2xl lg:mx-auto lg:max-w-5xl"
          }`}
        >
          {/* Barra de navegación iOS (solo mobile) */}
          <div className="relative flex h-12 shrink-0 select-none items-center justify-between border-b border-desk-line/[0.06] px-3 md:hidden">
            {backHref ? (
              <Link
                href={backHref}
                className="relative z-10 flex items-center gap-0.5 rounded-lg px-1.5 py-1 text-[15px] font-medium text-blue-500 active:opacity-60"
              >
                <CaretLeft size={18} weight="bold" />
                <span>Back</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={closeWindow}
                className="relative z-10 flex items-center gap-0.5 rounded-lg px-1.5 py-1 text-[15px] font-medium text-blue-500 active:opacity-60"
              >
                <CaretLeft size={18} weight="bold" />
                <span>Home</span>
              </button>
            )}

            <h2 className="pointer-events-none absolute inset-x-0 truncate px-24 text-center text-[15px] font-semibold text-desk-fg">
              {title}
            </h2>

            <button
              type="button"
              onClick={closeWindow}
              aria-label="All Apps"
              className="relative z-10 flex items-center gap-1 rounded-full bg-desk-line/[0.07] px-2.5 py-1 text-[12px] font-medium text-desk-fg/80 active:scale-95"
            >
              <SquaresFour size={15} weight="duotone" className="text-blue-500" />
              <span>Apps</span>
            </button>
          </div>

          {/* Barra de título macOS (solo desktop) */}
          <div
            onDoubleClick={toggleMaximize}
            className="relative hidden h-11 shrink-0 select-none items-center border-b border-desk-line/[0.06] px-4 md:flex"
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

          {/* Home Indicator de iPhone (solo mobile): tocar o deslizar hacia arriba cierra la app */}
          <button
            type="button"
            onClick={closeWindow}
            onTouchStart={onHomeBarTouchStart}
            onTouchEnd={onHomeBarTouchEnd}
            aria-label="Go to Home Screen"
            className="flex h-7 w-full shrink-0 select-none items-center justify-center border-t border-desk-line/[0.04] md:hidden"
          >
            <span className="h-[5px] w-32 rounded-full bg-desk-fg/35 transition-transform active:scale-95" />
          </button>
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
