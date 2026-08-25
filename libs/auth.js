import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./mongo";
import config from "@/config";

// Portafolio de una sola persona: no hay registro ni roles. El gate es el mismo
// que tenía el flujo de remix-auth — un correo verificado que además coincida
// con ALLOWED_EMAIL. Cualquier otra cuenta de Google rebota al login.
function esDuenio(profile) {
  return (
    profile?.email_verified === true &&
    !!process.env.ALLOWED_EMAIL &&
    profile.email === process.env.ALLOWED_EMAIL
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // NextAuth v5 rechaza el request con UntrustedHost si el Host no está en su
  // allowlist. Detrás del proxy de Vercel el Host lo pone la plataforma.
  trustHost: true,
  // Solo se monta el adapter si hay conexión: así un build sin MONGODB_URI
  // (o un preview a medio configurar) no truena al evaluar este módulo.
  ...(clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  // JWT y no sesión en DB: con un solo usuario, pegarle a Mongo en cada lectura
  // de sesión no compra nada.
  session: { strategy: "jwt" },
  pages: {
    signIn: config.auth.loginUrl,
    error: config.auth.loginUrl,
  },
  callbacks: {
    signIn({ profile }) {
      return esDuenio(profile);
    },
  },
});
