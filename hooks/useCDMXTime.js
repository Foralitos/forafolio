"use client";

import { createContext, useContext } from "react";

// Fallback si alguien usa el hook fuera del provider: replica el estado inicial
// que tenía el hook en Remix.
const VALOR_POR_DEFECTO = { formattedTime: "", hour: 0, isDaytime: true };

export const CDMXTimeContext = createContext(VALOR_POR_DEFECTO);

// En Remix cada componente corría su propio setInterval y arrancaba con la hora
// en blanco, así que la primera pintura siempre era "de día" y saltaba a noche
// al hidratar. Ahora la hora se calcula en el servidor, viaja como prop al
// provider (components/common/CDMXTimeProvider.jsx) y un solo interval la
// mantiene viva para toda la landing.
export function useCDMXTime() {
  return useContext(CDMXTimeContext);
}
