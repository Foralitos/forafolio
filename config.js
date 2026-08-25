// Config del proyecto, heredada de ShipFast pero podada a lo que el portafolio
// realmente usa: no hay Stripe, ni Crisp, ni Mailgun, ni planes de pago.
const config = {
  appName: "Fora",
  appDescription:
    "Portafolio de Fora — founder y dev en Chihuahua. Proyectos, blog y notas de construcción.",
  // Sin https:// ni slash final. No hay dominio custom: el sitio vive en el
  // subdominio que asigna Vercel.
  domainName: "forafolio.vercel.app",
  resend: {
    // Remitente de cualquier correo transaccional. Sin dominio verificado en
    // Resend, el único `from` que funciona es este de prueba.
    fromAdmin: "Fora <onboarding@resend.dev>",
    supportEmail: "elfora.dev@gmail.com",
  },
  auth: {
    // A dónde manda NextAuth cuando alguien sin sesión toca una ruta privada.
    loginUrl: "/login",
    // A dónde cae el usuario después de un login exitoso.
    callbackUrl: "/admin",
  },
};

export default config;
