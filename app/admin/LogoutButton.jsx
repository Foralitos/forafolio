"use client";

import { signOut } from "next-auth/react";

// En Remix el logout era una ruta (/logout) que destruía la cookie. Con
// NextAuth v5 el endpoint ya existe; solo hace falta dispararlo con su CSRF.
export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full text-center text-xs text-red-300 hover:text-white border-2 border-red-500/40 hover:border-red-400 hover:bg-red-500/10 py-2 transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
