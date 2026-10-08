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
        className="relative mx-3 mt-3 flex h-56 items-end overflow-hidden rounded-xl bg-cover bg-center md:mx-4 md:mt-4 md:h-72"
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
        <p className="max-w-xl text-[15px] leading-relaxed text-desk-fg/75">
          Welcome to my computer. Open any icon on the desktop to look around,
          or start here:
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="rounded-full bg-blue-500 px-4 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-blue-600"
          >
            About me
          </Link>
          <Link
            href="/projects"
            className="rounded-full bg-desk-line/10 px-4 py-1.5 text-[13px] font-medium hover:bg-desk-line/15"
          >
            See projects
          </Link>
        </div>
      </div>
    </div>
  );
}
