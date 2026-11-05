// Datos de la campaña de /apoyo (TrepCamp Madrid). Lo recaudado sale de los
// aportes pagados en Stripe (colección Donation); `offline` suma lo que llegue
// por fuera (transferencias, efectivo) y se actualiza a mano.
export const CAMPAIGN = {
  id: "trepcamp-madrid-2027",
  goal: 3000, // USD
  offline: { raised: 0, backers: 0 },
  // Fin del 15 de diciembre de 2026 en hora de Chihuahua/CDMX (UTC-6).
  deadline: "2026-12-16T06:00:00Z",
  amounts: [10, 25, 50, 100],
  defaultAmount: 25,
  minAmount: 1,
  maxAmount: 5000,
  // URL del video (MP4). Mientras sea null se muestra el póster.
  videoUrl: null,
  facts: [
    ["Beca", "50% de la matrícula"],
    ["Sede", "Madrid, España"],
    ["Track", "Sports Business"],
    ["Fecha límite para juntar", "15 de diciembre de 2026"],
    ["Programa", "Enero 2027"],
  ],
  // A qué se destina lo que se junte, sin montos.
  uses: [
    "La otra mitad de la matrícula del programa",
    "El vuelo a Madrid",
    "Hospedaje durante la semana del programa",
    "Transporte y comida allá",
  ],
};

// Días que faltan para el cierre, contados en el servidor.
export function daysLeft(deadline, now = Date.now()) {
  return Math.max(0, Math.ceil((new Date(deadline) - now) / 864e5));
}
