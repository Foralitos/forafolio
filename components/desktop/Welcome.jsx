"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, LinkedinLogo } from "phosphor-react";
import { LINKS } from "./apps";
import { XLogo } from "./XLogo";
import { ProjectCover } from "@/components/landing/ProjectCover";

const EMAIL = "elfora.dev@gmail.com";

// En qué anda Fora ahorita. Se edita a mano aquí.
const CURRENTLY = [
  "Building Furbo, an AI WhatsApp agent for sports predictions.",
  "Running El Atlético, a sports newsletter written with AI.",
  "Turning this portfolio into a tiny Mac.",
];

// El highlight de las frases clave: el equivalente en azul de Mac del
// subrayado naranja de PostHog.
function Mark({ children }) {
  return (
    <mark className="rounded-md bg-blue-500/15 px-1.5 text-blue-600 [box-decoration-break:clone] dark:text-blue-400">
      {children}
    </mark>
  );
}

// La ventana de inicio: explica quién es Fora y a dónde ir. Es larga a
// propósito y se recorre con el scroll de la ventana, como la home de PostHog.
export function Welcome({ projects = [] }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = LINKS.email;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-12 md:py-14">
      {/* Hero */}
      <div className="grid items-center gap-10 md:grid-cols-[1.25fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-neuebit text-2xl tracking-wider text-desk-fg/70">Fora Delgado</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            I build products people <Mark>actually use.</Mark>
          </h1>
          <p className="mt-6 text-lg font-medium md:text-xl">
            Founder & developer from Chihuahua, Mexico.{" "}
            <span className="font-normal italic text-desk-fg/55">(Yes, like the dog.)</span>
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-desk-fg/70">
            I spend my days turning ideas into real products: AI agents, web
            apps and sports media. This computer is where I keep all of it.
            Open any icon to look around, or <Mark>just say hi.</Mark>
          </p>
        </motion.div>

        {/* Mascota: Fora en caricatura saludando (generada con Higgsfield a
            partir del personaje de About, fondo recortado), con su sombra en
            el piso. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot/hello.webp"
            alt="Fora waving hello"
            draggable={false}
            className="relative z-10 h-[380px] w-auto select-none drop-shadow-xl md:h-[500px]"
          />
          <div className="absolute bottom-1 h-5 w-40 rounded-[50%] bg-black/25 blur-md" />
        </motion.div>
      </div>

      {/* Caja de acción */}
      <div className="panel mt-12 max-w-xl rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Let&apos;s talk</h2>
          <a
            href={LINKS.agenda}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[14px] text-desk-fg/70 hover:text-blue-500"
          >
            Book a call <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-desk-line/[0.05] px-4 py-3 font-mono text-[14px] ring-1 ring-inset ring-desk-line/10">
          <span className="truncate">
            <span className="text-orange-500">$</span>{" "}
            <span className="text-blue-500">mail</span> {EMAIL}
          </span>
          <button
            type="button"
            onClick={copyEmail}
            aria-label="Copy email"
            className="shrink-0 rounded-md p-1 text-desk-fg/50 hover:bg-desk-line/10 hover:text-desk-fg"
          >
            {copied ? <Check size={16} weight="bold" className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
        <p className="mt-3 text-[13px] text-desk-fg/55">
          Spanish or English, both work.
        </p>
      </div>

      {/* Proyectos */}
      {projects.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">What I&apos;m building</h2>
            <Link href="/projects" className="text-[14px] text-blue-500 hover:underline">
              See all
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="panel group overflow-hidden rounded-2xl transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="aspect-[16/10] overflow-hidden bg-desk-line/5">
                  <ProjectCover
                    project={project}
                    autoPlay={false}
                    titleClassName="text-3xl"
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-semibold">{project.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-desk-fg/65">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ahora mismo */}
      <section className="mt-16 grid gap-8 border-t border-desk-line/10 pt-10 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-desk-fg/50">Currently</h2>
          <ul className="mt-3 space-y-2 text-[15px] text-desk-fg/80">
            {CURRENTLY.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-start gap-2">
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="rounded-full p-2.5 text-desk-fg/70 ring-1 ring-desk-line/10 hover:bg-desk-line/10 hover:text-desk-fg"
          >
            <LinkedinLogo size={18} weight="fill" />
          </a>
          <a
            href={LINKS.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="rounded-full p-2.5 text-desk-fg/70 ring-1 ring-desk-line/10 hover:bg-desk-line/10 hover:text-desk-fg"
          >
            <XLogo size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
