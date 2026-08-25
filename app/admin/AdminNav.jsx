"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Inicio", end: true },
  { href: "/admin/projects", label: "Proyectos", end: false },
  { href: "/admin/blog", label: "Blog", end: false },
];

// Sustituye al <NavLink> de Remix: el estado activo se calcula del pathname.
export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex md:flex-col p-4 gap-2 flex-1">
      {navItems.map((item) => {
        const isActive = item.end
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 border-2 text-sm transition-colors ${
              isActive
                ? "border-white bg-white text-gray-900"
                : "border-gray-700 text-gray-300 hover:border-white hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
