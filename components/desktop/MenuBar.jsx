"use client";

import Link from "next/link";
import { LinkedinLogo } from "phosphor-react";
import { useCDMXTime } from "@/hooks/useCDMXTime";
import { useDesktop } from "./Desktop";
import { APPS, LINKS } from "./apps";
import { XLogo } from "./XLogo";

// En desktop (md+): barra de menú estilo macOS, flotante y redondeada.
// En mobile (< md): Status Bar de iPhone con hora CDMX a la
// izquierda e íconos de señal, Wi-Fi y batería a la derecha.
export function MenuBar() {
  const { formattedTime } = useCDMXTime();
  const { openWindow } = useDesktop();
  const shortTime = formattedTime ? formattedTime.replace(/\s?[AP]M$/i, "") : "9:41";

  return (
    <>
      {/* Status Bar de iOS (solo mobile) */}
      <header className="absolute inset-x-0 top-0 z-50 flex h-11 select-none items-center justify-between px-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:hidden">
        <span
          title="Fora's local time (CDMX)"
          className="w-16 text-[15px] font-semibold tracking-tight tabular-nums"
        >
          {shortTime}
        </span>

        {/* Íconos de estado iOS: Señal, Wi-Fi, Batería */}
        <div className="flex w-16 items-center justify-end gap-1.5" aria-hidden>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
            <rect x="0" y="7" width="2.8" height="4" rx="0.8" />
            <rect x="4.2" y="5" width="2.8" height="6" rx="0.8" />
            <rect x="8.4" y="2.5" width="2.8" height="8.5" rx="0.8" />
            <rect x="12.6" y="0" width="2.8" height="11" rx="0.8" />
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
            <path d="M7.5 10.8a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7Zm-3.1-3.6a4.5 4.5 0 0 1 6.2 0l1.1-1.15a6.1 6.1 0 0 0-8.4 0L4.4 7.2Zm-2.4-2.45a8 8 0 0 1 11 0l1.1-1.15a9.6 9.6 0 0 0-13.2 0L2 4.75Z" />
          </svg>
          <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
            <rect
              x="0.5"
              y="0.5"
              width="20"
              height="10"
              rx="3"
              stroke="currentColor"
              strokeOpacity="0.45"
            />
            <rect x="2" y="2" width="17" height="7" rx="1.5" fill="currentColor" />
            <path d="M22 3.8v3.4a1.7 1.7 0 0 0 0-3.4Z" fill="currentColor" fillOpacity="0.5" />
          </svg>
        </div>
      </header>

      {/* Barra de menú de macOS (solo desktop) */}
      <header className="glass glass-float absolute inset-x-3 top-3 z-40 hidden h-10 items-center justify-between rounded-2xl px-4 text-[14px] transition-colors duration-[2000ms] md:flex">
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            onClick={() => openWindow("/")}
            className="rounded-lg px-2 py-0.5 font-semibold hover:bg-desk-line/10"
          >
            Fora
          </Link>
          {APPS.filter((app) => app.menu).map((app) => (
            <Link
              key={app.id}
              href={app.href}
              onClick={() => openWindow(app.href)}
              className="rounded-lg px-2 py-0.5 hover:bg-desk-line/10"
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
            className="rounded-lg p-1 hover:bg-desk-line/10"
          >
            <LinkedinLogo size={15} weight="fill" />
          </a>
          <a
            href={LINKS.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="rounded-lg p-1 hover:bg-desk-line/10"
          >
            <XLogo size={14} />
          </a>
          <a
            href={LINKS.agenda}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 rounded-full bg-blue-500 px-3 py-0.5 text-xs font-medium text-white hover:bg-blue-600"
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
    </>
  );
}
