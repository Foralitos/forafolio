"use client";

import { useEffect, useState } from "react";
import { CDMXTimeContext } from "@/hooks/useCDMXTime";
import { calcularCDMXTime } from "@/libs/cdmxTime";

// Un solo reloj para toda la landing. Recibe del Server Component la hora ya
// calculada, así que el HTML que llega al navegador ya trae el fondo, los
// colores y el reloj correctos: no hay parpadeo día→noche al hidratar.
export default function CDMXTimeProvider({ initial, children }) {
  const [time, setTime] = useState(initial);

  useEffect(() => {
    // El servidor calculó la hora al momento de responder; entre eso y la
    // hidratación pudo pasar tiempo (CDN, pestaña en background), así que se
    // recalcula de inmediato y luego cada segundo.
    const actualizar = () => setTime(calcularCDMXTime());
    actualizar();
    const interval = setInterval(actualizar, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CDMXTimeContext.Provider value={time}>{children}</CDMXTimeContext.Provider>
  );
}
