"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

// El botón es cliente porque signIn() de next-auth/react arma el POST al
// endpoint de NextAuth con el CSRF token. El resto de la página es server.
export default function LoginForm() {
  const [cargando, setCargando] = useState(false);

  return (
    <button
      type="button"
      disabled={cargando}
      onClick={() => {
        setCargando(true);
        signIn("google", { callbackUrl: "/admin" });
      }}
      className="w-full border-2 border-white bg-white/10 hover:bg-white hover:text-gray-900 text-white text-center py-3 transition-colors duration-200 disabled:opacity-50"
    >
      <span className="font-pixel text-xs">
        {cargando ? "..." : "▶ SIGN IN WITH GOOGLE"}
      </span>
    </button>
  );
}
