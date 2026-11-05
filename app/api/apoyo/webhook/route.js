import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStripe } from "@/libs/stripe";
import { recordDonation } from "@/models/Donation";

// Stripe avisa aquí cuando un pago de Checkout queda pagado. Se registra el
// aporte y se revalida /apoyo para que la barra suba.
//
// La firma se verifica contra el body crudo: por eso req.text() y no
// req.json().
export async function POST(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[apoyo/webhook] Falta STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook sin configurar" }, { status: 500 });
  }

  const body = await req.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, req.headers.get("stripe-signature"), secret);
  } catch (err) {
    console.error("[apoyo/webhook] Firma inválida:", err.message);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  // `completed` llega pagado con tarjeta; con métodos diferidos (OXXO, etc.)
  // el pago se confirma después en `async_payment_succeeded`.
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const s = event.data.object;
    if (s.payment_status === "paid" && s.metadata?.campaign) {
      await recordDonation({
        campaign: s.metadata.campaign,
        sessionId: s.id,
        paymentIntentId: typeof s.payment_intent === "string" ? s.payment_intent : null,
        amount: s.amount_total,
        currency: s.currency,
        email: s.customer_details?.email ?? null,
        livemode: s.livemode,
      });
      revalidatePath("/apoyo");
    }
  }

  return NextResponse.json({ received: true });
}
