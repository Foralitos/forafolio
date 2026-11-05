import { NextResponse } from "next/server";
import { getStripe } from "@/libs/stripe";
import { CAMPAIGN, daysLeft } from "@/libs/apoyo";

// Crea una sesión de Stripe Checkout por el monto que eligió la persona y
// devuelve la URL a donde redirigir. El monto se valida aquí: el cliente
// puede mandar cualquier cosa.
export async function POST(req) {
  let amount;
  try {
    ({ amount } = await req.json());
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  amount = Number(amount);
  if (!Number.isInteger(amount) || amount < CAMPAIGN.minAmount || amount > CAMPAIGN.maxAmount) {
    return NextResponse.json(
      { error: `El monto debe ser un número entero entre $${CAMPAIGN.minAmount} y $${CAMPAIGN.maxAmount} USD.` },
      { status: 400 }
    );
  }
  if (daysLeft(CAMPAIGN.deadline) === 0) {
    return NextResponse.json({ error: "La campaña ya cerró." }, { status: 410 });
  }

  const origin = req.headers.get("origin") || new URL(req.url).origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amount * 100,
            product_data: {
              name: "Apoyo para TrepCamp Madrid",
              description: "Gracias por ayudarme a llegar a Madrid.",
            },
          },
        },
      ],
      metadata: { campaign: CAMPAIGN.id },
      payment_intent_data: { metadata: { campaign: CAMPAIGN.id } },
      success_url: `${origin}/apoyo?gracias={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/apoyo`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[apoyo/checkout]", err);
    return NextResponse.json(
      { error: "No se pudo abrir el pago. Intenta de nuevo en un momento." },
      { status: 500 }
    );
  }
}
