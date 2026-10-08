import {
  House,
  User,
  FolderSimple,
  Notebook,
  EnvelopeSimple,
  CalendarBlank,
  Trash,
} from "phosphor-react";

// Las "apps" del escritorio. Un solo lugar alimenta los íconos de los lados,
// el Dock de móvil y la barra de menú, así que agregar una sección es agregar
// una fila aquí. Cada ícono es un glifo de Phosphor que DesktopIcon pinta en
// blanco dentro de un squircle de vidrio (el modo "Clear" de macOS Tahoe).
//
// - href interno → abre su ventana dentro del escritorio.
// - external → sale del sitio en otra pestaña.
// - href null → ícono decorativo (la Papelera, por ahora).
export const APPS = [
  { id: "home", label: "Home", href: "/", Icon: House, side: "left" },
  { id: "about", label: "About", href: "/about", Icon: User, side: "left", menu: true },
  { id: "projects", label: "Projects", href: "/projects", Icon: FolderSimple, side: "left", menu: true },
  // El blog sigue siendo una página completa fuera del escritorio.
  { id: "blog", label: "Blog", href: "/blog", Icon: Notebook, side: "left", menu: true },
  { id: "contact", label: "Contact", href: "/contact", Icon: EnvelopeSimple, side: "right", menu: true },
  {
    id: "calendar",
    label: "Book a call",
    href: "https://tidycal.com/elforadev/15-minute-meeting",
    Icon: CalendarBlank,
    side: "right",
    external: true,
  },
  { id: "trash", label: "Trash", href: null, Icon: Trash, side: "right" },
];

export const LINKS = {
  email: "mailto:elfora.dev@gmail.com",
  linkedin: "https://linkedin.com/in/foradelgado",
  x: "https://x.com/ElforaDev",
  agenda: "https://tidycal.com/elforadev/15-minute-meeting",
};
