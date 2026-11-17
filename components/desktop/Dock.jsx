"use client";

import { DesktopIcon } from "./DesktopIcon";
import { APPS } from "./apps";

// Dock de iPhone (solo mobile): cápsula inferior con las 4 apps principales
// y la píldora indicadora de página de iOS arriba. Cuando hay una app abierta,
// la ventana (z-40) cubre el Dock como en iOS real.
export function Dock() {
  return (
    <div className="md:hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[106px] z-20 flex justify-center"
      >
        <span className="flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Fora&apos;s iPhone
        </span>
      </div>
      <nav
        aria-label="Dock"
        className="glass glass-float absolute inset-x-3 bottom-3 z-20 flex h-[86px] items-center justify-around rounded-[28px] px-3"
      >
        {APPS.filter((app) => app.dock).map((app) => (
          <DesktopIcon key={app.id} app={app} compact />
        ))}
      </nav>
    </div>
  );
}
