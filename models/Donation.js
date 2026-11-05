import "server-only";
import mongoose from "mongoose";
import connectMongo from "@/libs/mongoose";

// Un aporte pagado en Stripe Checkout para una campaña de /apoyo. Lo escribe
// solo el webhook; `sessionId` único hace que un evento repetido de Stripe no
// cuente dos veces el mismo pago.
const donationSchema = new mongoose.Schema(
  {
    campaign: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true },
    paymentIntentId: { type: String, default: null },
    amount: { type: Number, required: true }, // centavos
    currency: { type: String, required: true },
    email: { type: String, default: null },
    livemode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema);

export async function recordDonation(data) {
  await connectMongo();
  await Donation.updateOne(
    { sessionId: data.sessionId },
    { $setOnInsert: data },
    { upsert: true }
  );
}

// Total recaudado (en dólares) y número de aportes de una campaña. Solo
// cuentan los aportes del mismo modo que la llave activa: en local (sk_test)
// suman los de prueba y en producción (sk_live) solo los reales, aunque los
// dos vivan en la misma base.
export async function getCampaignTotals(campaign) {
  await connectMongo();
  const livemode = Boolean(process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_"));
  const [row] = await Donation.aggregate([
    { $match: { campaign, livemode } },
    { $group: { _id: null, cents: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);
  return { raised: Math.round((row?.cents ?? 0) / 100), backers: row?.count ?? 0 };
}
