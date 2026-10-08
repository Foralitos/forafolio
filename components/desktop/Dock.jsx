"use client";

import { DesktopIcon } from "./DesktopIcon";
import { APPS } from "./apps";

// En celular no caben las columnas de íconos: se juntan en un Dock abajo.
export function Dock() {
  return (
    <nav className="absolute inset-x-2 bottom-2 z-40 flex h-16 items-center justify-around rounded-2xl border border-white/20 bg-desk-bar/60 px-2 backdrop-blur-xl md:hidden">
      {APPS.filter((app) => app.href).map((app) => (
        <DesktopIcon key={app.id} app={app} compact />
      ))}
    </nav>
  );
}
