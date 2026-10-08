"use client";

import Link from "next/link";
import { LinkedinLogo } from "phosphor-react";
import { useCDMXTime } from "@/hooks/useCDMXTime";
import { useDesktop } from "./Desktop";
import { APPS, LINKS } from "./apps";
import { XLogo } from "./XLogo";

// La barra de menú de macOS: translúcida, 32px, fuente de sistema.
export function MenuBar() {
  const { formattedTime } = useCDMXTime();
  const { openWindow } = useDesktop();

  return (
    <header className="glass absolute inset-x-0 top-0 z-40 flex h-8 items-center justify-between px-3 text-[13px] transition-colors duration-[2000ms] md:px-4">
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
          <XLogo size={14} />
        </a>
        <a
          href={LINKS.agenda}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 hidden rounded-full bg-blue-500 px-3 py-0.5 text-xs font-medium text-white hover:bg-blue-600 sm:block"
        >
          Book a call
        </a>
        <span
          title="Fora's local time (CDMX)"
          className="ml-2 cursor-default tabular-nums"
        >
          {formattedTime}
        </span>
      </div>
    </header>
  );
}
