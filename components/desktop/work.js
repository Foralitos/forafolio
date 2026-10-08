// La tarjeta "work" del Inicio. Se edita a mano aquí: el más reciente arriba.
// `logo` es una imagen en public/logos; sin logo se dibuja un ícono genérico.
export const WORK = [
  {
    company: "Sport Metrics",
    role: "co-founder",
    years: "2026 — present",
    logo: "/logos/sportmetrics.webp",
    href: "/projects/sport-metrics",
  },
  {
    company: "PID Electronics",
    role: "developer",
    years: "2026 — present",
    logo: "/logos/pid.webp",
    href: "https://pidelectronics.com",
  },
  {
    company: "Molusco · Grupo HG (KIA)",
    role: "full-stack developer",
    years: "2025",
    logo: null,
    href: null,
  },
  {
    company: "Freelance",
    role: "full-stack developer",
    years: "2024 — present",
    logo: null,
    href: null,
  },
  {
    company: "Cherry Labs · Integral Vending",
    role: "full-stack developer",
    years: "2024",
    logo: null,
    href: null,
  },
];

// Los CV en PDF viven en public/cv. Hasta que existan, el botón no se muestra.
export const CV = {
  ready: false,
  es: "/cv/fora-delgado-cv-es.pdf",
  en: "/cv/fora-delgado-cv-en.pdf",
};
