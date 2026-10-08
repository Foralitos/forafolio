"use client";

import { DesktopIcon } from "./DesktopIcon";
import { APPS } from "./apps";

// En celular no caben las columnas de íconos: se juntan en un Dock abajo.
export function Dock() {
  return (
    <nav className="glass glass-float absolute inset-x-2 bottom-2 z-40 flex h-[68px] items-center justify-around rounded-[22px] px-2 md:hidden">
      {APPS.filter((app) => app.href).map((app) => (
        <DesktopIcon key={app.id} app={app} compact />
      ))}
    </nav>
  );
}
