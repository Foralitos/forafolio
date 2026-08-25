// Sin directiva: este módulo lo llaman TANTO el Server Component que renderiza
// la landing (para mandar la hora correcta en el primer HTML) COMO el provider
// del cliente (para el tick de cada segundo). Si viviera en un archivo
// "use client", el servidor solo vería una referencia de cliente y no podría
// ejecutarlo.
//
// El sitio no usa la hora del visitante: el día y la noche del portafolio son
// los de la Ciudad de México, a propósito.
export function calcularCDMXTime(ahora = new Date()) {
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(ahora);

  const hour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Mexico_City",
      hour: "numeric",
      hour12: false,
    }).format(ahora),
    10
  );

  return { formattedTime, hour, isDaytime: hour >= 6 && hour < 18 };
}
