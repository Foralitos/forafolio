// Las "apps" del escritorio. Un solo lugar alimenta los íconos de los lados,
// el Dock de móvil y la barra de menú, así que agregar una sección es agregar
// una fila aquí. Íconos: Fluent Emoji 3D de Microsoft (MIT), en public/icons.
//
// - href interno → abre su ventana dentro del escritorio.
// - external → sale del sitio en otra pestaña.
// - href null → ícono decorativo (la Papelera, por ahora).
export const APPS = [
  { id: "home", label: "Inicio", href: "/", icon: "/icons/house.png", side: "left" },
  { id: "about", label: "Sobre mí", href: "/about", icon: "/icons/about.png", side: "left", menu: true },
  { id: "projects", label: "Proyectos", href: "/projects", icon: "/icons/projects.png", side: "left", menu: true },
  // El blog sigue siendo una página completa fuera del escritorio en esta
  // primera versión.
  { id: "blog", label: "Blog", href: "/blog", icon: "/icons/blog.png", side: "left", menu: true },
  { id: "contact", label: "Contacto", href: "/contact", icon: "/icons/contact.png", side: "right", menu: true },
  {
    id: "calendar",
    label: "Agendar llamada",
    href: "https://tidycal.com/elforadev/15-minute-meeting",
    icon: "/icons/calendar.png",
    side: "right",
    external: true,
  },
  { id: "trash", label: "Papelera", href: null, icon: "/icons/trash.png", side: "right" },
];

export const LINKS = {
  linkedin: "https://linkedin.com/in/foradelgado",
  x: "https://x.com/ElforaDev",
  agenda: "https://tidycal.com/elforadev/15-minute-meeting",
};
