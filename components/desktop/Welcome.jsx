"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCDMXTime } from "@/hooks/useCDMXTime";

// La ventana de inicio: lo que antes era el Hero, ahora en tamaño ventana. La
// franja de arriba muestra la misma escena del wallpaper.
export function Welcome() {
  const { isDaytime } = useCDMXTime();

  return (
    <div>
      <div
        className="relative flex h-56 items-end bg-cover bg-center md:h-72"
        style={{
          backgroundImage: `url(${isDaytime ? "/ForaDay.png" : "/ForaNight.png"})`,
          imageRendering: "pixelated",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative px-6 pb-5 md:px-10 md:pb-7"
        >
          <h1 className="font-neuebit text-5xl leading-none tracking-wider text-white md:text-7xl">
            Fora Delgado
          </h1>
          <p className="mt-2 font-mondwest text-lg text-white/90 md:text-2xl">
            Developer & Digital Creator
          </p>
        </motion.div>
      </div>

      <div className="px-6 py-8 md:px-10">
        <p className="max-w-xl text-[15px] leading-relaxed text-desk-muted">
          Bienvenido a mi compu. Abre cualquier ícono del escritorio para
          explorar, o empieza por aquí:
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500"
          >
            Sobre mí
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-desk-line/15 bg-desk-chrome px-4 py-2 text-sm font-medium hover:bg-desk-line/10"
          >
            Ver proyectos
          </Link>
        </div>
      </div>
    </div>
  );
}
