import "server-only";
import Stripe from "stripe";

// Cliente de Stripe creado al primer uso: la llave se lee dentro de la
// función por la misma razón que MONGODB_URI en libs/mongoose.js (si se lee
// al importar, el build de Next truena cuando la variable no está).
let client = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Falta la variable de entorno STRIPE_SECRET_KEY");
  if (!client) client = new Stripe(key);
  return client;
}
