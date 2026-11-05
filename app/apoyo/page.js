import { getSEOTags } from "@/libs/seo";
import { CAMPAIGN, daysLeft } from "@/libs/apoyo";
import { getCampaignTotals } from "@/models/Donation";
import { getStripe } from "@/libs/stripe";
import Campaign from "@/components/apoyo/Campaign";

export const metadata = getSEOTags({
  title: "Fora a Madrid — Apoyo",
  description:
    "Me gané media beca para TrepCamp Madrid. Ayúdame a juntar la otra mitad antes del 15 de diciembre.",
  canonicalUrlRelative: "/apoyo",
});

// Cada visita lee el total al momento: la barra tiene que reflejar el último
// aporte, y los días restantes cambian a diario.
export const dynamic = "force-dynamic";

// Página propia, fuera del layout (desktop): a propósito no lleva barra de
// menú, ventanas ni wallpaper, para que no se sienta como el portafolio.
// Siempre en tema claro, sin importar el sistema del visitante.
export default async function ApoyoPage({ searchParams }) {
  const { gracias } = await searchParams;

  // Al volver de Stripe, ?gracias=<id de sesión>: se consulta la sesión para
  // agradecer con el monto exacto. Solo cuenta si está pagada y es de esta
  // campaña; si algo falla, el modal sale igual pero sin monto.
  let thanks = null;
  if (typeof gracias === "string" && gracias) {
    thanks = { amount: null };
    if (gracias.startsWith("cs_")) {
      try {
        const s = await getStripe().checkout.sessions.retrieve(gracias);
        if (s.payment_status === "paid" && s.metadata?.campaign === CAMPAIGN.id) {
          thanks.amount = Math.round(s.amount_total / 100);
        }
      } catch (err) {
        console.error("[apoyo] No se pudo leer la sesión de Stripe:", err.message);
      }
    }
  }

  let totals = { raised: 0, backers: 0 };
  try {
    totals = await getCampaignTotals(CAMPAIGN.id);
  } catch (err) {
    // Sin Mongo la página sigue sirviendo; solo la barra sale en cero.
    console.error("[apoyo] No se pudo leer el total:", err);
  }

  return (
    <div
      className="min-h-screen bg-[#f5f7fa] px-4 pb-10 font-sans text-[#1d1d1f]"
      style={{ colorScheme: "light" }}
    >
      <Campaign
        campaign={CAMPAIGN}
        raised={totals.raised + CAMPAIGN.offline.raised}
        backers={totals.backers + CAMPAIGN.offline.backers}
        days={daysLeft(CAMPAIGN.deadline)}
        thanks={thanks}
      />
    </div>
  );
}
