"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Check,
  Copy,
  DownloadSimple,
  InstagramLogo,
  LinkedinLogo,
} from "phosphor-react";
import { LINKS } from "./apps";
import { XLogo } from "./XLogo";
import { GithubMark } from "./GithubMark";
import { NowPlaying } from "./NowPlaying";
import { WORK, CV } from "./work";

const EMAIL = "elfora.dev@gmail.com";

// Fotos de la tira; al pasar el mouse se enderezan.
const FOTOS = [
  { src: "/photos/photo-1.webp", alt: "Portrait in the mountains" },
  { src: "/photos/photo-4.webp", alt: "Pitching Klai at Platanus Hack 26" },
  { src: "/photos/photo-2.webp", alt: "At the Rayados locker room" },
  { src: "/photos/photo-5.webp", alt: "Team photo at Platanus Hack 26" },
  { src: "/photos/photo-3.webp", alt: "Walking through the city at night" },
  { src: "/photos/photo-6.webp", alt: "Laughing with the team at Platanus Hack 26" },
  { src: "/photos/photo-7.webp", alt: "Giving a talk"  },
  { src: "/photos/photo-8.webp", alt: "With the community" },
];

const REDES = [
  { href: LINKS.x, label: "X", icon: <XLogo size={20} /> },
  { href: LINKS.github, label: "GitHub", icon: <GithubMark size={20} /> },
  { href: LINKS.linkedin, label: "LinkedIn", icon: <LinkedinLogo size={22} /> },
  { href: LINKS.instagram, label: "Instagram", icon: <InstagramLogo size={22} /> },
];

function Enlace({ href, children }) {
  return (
    <Link href={href} className="text-blue-600 hover:underline dark:text-blue-400">
      {children}
    </Link>
  );
}

function TiraDeFotos() {
  return (
    // Sale de los márgenes de la ventana, como en la inspo; scroll lateral.
    <div className="-mx-6 mt-14 overflow-x-auto pb-6 pt-4 [scrollbar-width:none] md:-mx-12 [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-5 px-6 md:px-12">
        {FOTOS.map((foto, i) => (
          <motion.div
            key={foto.src}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className={`group relative h-[300px] w-[240px] shrink-0 overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] md:h-[380px] md:w-[300px] ${
              i % 2 ? "rotate-[2deg]" : "-rotate-[2deg]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto.src}
              alt={foto.alt}
              loading={i > 2 ? "lazy" : "eager"}
              draggable={false}
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Work() {
  // El CV sale en español si el navegador del visitante está en español.
  const descargarCV = (e) => {
    if (navigator.language?.toLowerCase().startsWith("es")) {
      e.preventDefault();
      window.open(CV.es, "_blank");
    }
  };

  return (
    <div className="panel rounded-2xl p-5">
      <h2 className="flex items-center gap-2.5 text-[15px] font-semibold">
        <Briefcase size={20} className="text-desk-fg/50" /> work
      </h2>
      <ul className="mt-4 space-y-4">
        {WORK.map((w) => {
          const contenido = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-desk-win ring-1 ring-desk-line/10">
                {w.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Briefcase size={20} weight="duotone" className="text-blue-500" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{w.company}</span>
                <span className="block text-[13px] text-desk-fg/55">{w.role}</span>
              </span>
              <span className="shrink-0 self-end text-[12px] text-desk-fg/45">{w.years}</span>
            </>
          );
          return (
            <li key={w.company}>
              {w.href ? (
                <a
                  href={w.href}
                  {...(w.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-3 rounded-xl hover:opacity-80"
                >
                  {contenido}
                </a>
              ) : (
                <div className="flex items-center gap-3">{contenido}</div>
              )}
            </li>
          );
        })}
      </ul>
      {CV.ready ? (
        <a
          href={CV.en}
          onClick={descargarCV}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-desk-line/[0.06] py-2.5 text-[14px] font-medium hover:bg-desk-line/10"
        >
          Download CV <DownloadSimple size={16} />
        </a>
      ) : null}
    </div>
  );
}

function LetsTalk() {
  const [copied, setCopied] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = LINKS.email;
    }
  };
  return (
    <div className="panel rounded-2xl p-5">
      <h2 className="text-[15px] font-semibold">let&apos;s talk</h2>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-desk-line/[0.05] px-3.5 py-2.5 font-mono text-[13px] ring-1 ring-inset ring-desk-line/10">
        <span className="truncate">
          <span className="text-orange-500">$</span> <span className="text-blue-500">mail</span> {EMAIL}
        </span>
        <button
          type="button"
          onClick={copiar}
          aria-label="Copy email"
          className="shrink-0 rounded-md p-1 text-desk-fg/50 hover:bg-desk-line/10 hover:text-desk-fg"
        >
          {copied ? <Check size={15} weight="bold" className="text-green-500" /> : <Copy size={15} />}
        </button>
      </div>
      <a
        href={LINKS.agenda}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-[13px] text-blue-600 hover:underline dark:text-blue-400"
      >
        or book a 15-min call →
      </a>
    </div>
  );
}

// La ventana de Inicio como presentación de Fora: titular, intro con links y
// redes a la izquierda, la mascota completa a la derecha; luego la tira de
// fotos y debajo la música, el contacto y su trabajo. Se recorre con el scroll
// de la ventana.
export function Welcome() {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden px-6 py-10 md:px-12 md:py-14">
      <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="min-w-0"
        >
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            developer, founder and indie maker from Chihuahua
          </h1>

          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-desk-fg/70">
            I&apos;m Fora. I co-founded <Enlace href="/projects/sport-metrics">Sport Metrics</Enlace>, built{" "}
            <Enlace href="/projects/justenvs">justenvs</Enlace> and{" "}
            <Enlace href="/projects/koi-school">Koi School</Enlace>, and won the New Interfaces track at
            Platanus Hack 26 with <Enlace href="/projects/klai">Klai</Enlace>.
          </p>

          <div className="mt-7 flex items-center gap-5 text-desk-fg/60">
            {REDES.map((red) => (
              <a
                key={red.label}
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={red.label}
                className="transition-colors hover:text-desk-fg"
              >
                {red.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Mascota completa: Fora en caricatura saludando, con su sombra. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative hidden justify-center md:flex"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot/hello.webp"
            alt="Fora waving hello"
            draggable={false}
            className="relative z-10 h-[420px] w-auto select-none drop-shadow-xl lg:h-[480px]"
          />
          <div className="absolute bottom-1 h-5 w-40 rounded-[50%] bg-black/25 blur-md" />
        </motion.div>
      </div>

      <TiraDeFotos />

      {/* Debajo de las fotos: música + contacto a la izquierda, trabajo a la derecha. */}
      <div className="mt-6 grid items-start gap-5 md:grid-cols-2">
        <div className="min-w-0 space-y-5">
          <NowPlaying />
          <LetsTalk />
        </div>
        <div className="min-w-0">
          <Work />
        </div>
      </div>
    </div>
  );
}
