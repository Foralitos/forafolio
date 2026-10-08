"use client";

import Link from "next/link";
import { LinkedinLogo } from "phosphor-react";
import { useCDMXTime } from "@/hooks/useCDMXTime";
import { useDesktop } from "./Desktop";
import { APPS, LINKS } from "./apps";

// phosphor-react 1.x no trae el logo nuevo de X.
function XLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// La barra de menú de macOS: translúcida, 32px, fuente de sistema.
export function MenuBar() {
  const { formattedTime } = useCDMXTime();
  const { openWindow } = useDesktop();

  return (
    <header className="absolute inset-x-0 top-0 z-40 flex h-8 items-center justify-between border-b border-desk-line/10 bg-desk-bar/70 px-3 text-[13px] backdrop-blur-xl transition-colors duration-[2000ms] md:px-4">
      <nav className="flex items-center gap-1">
        <Link
          href="/"
          onClick={openWindow}
          className="rounded px-2 py-0.5 font-semibold hover:bg-desk-line/10"
        >
          Fora
        </Link>
        {APPS.filter((app) => app.menu).map((app) => (
          <Link
            key={app.id}
            href={app.href}
            onClick={openWindow}
            className="hidden rounded px-2 py-0.5 hover:bg-desk-line/10 md:block"
          >
            {app.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-1">
        <a
          href={LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hidden rounded p-1 hover:bg-desk-line/10 sm:block"
        >
          <LinkedinLogo size={15} weight="fill" />
        </a>
        <a
          href={LINKS.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="hidden rounded p-1 hover:bg-desk-line/10 sm:block"
        >
          <XLogo className="h-3.5 w-3.5" />
        </a>
        <a
          href={LINKS.agenda}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 hidden rounded-md bg-desk-fg px-2.5 py-0.5 text-xs font-medium text-desk-bar hover:opacity-85 sm:block"
        >
          Agendar llamada
        </a>
        <span
          title="Hora de Fora (CDMX)"
          className="ml-2 cursor-default tabular-nums"
        >
          {formattedTime}
        </span>
      </div>
    </header>
  );
}
