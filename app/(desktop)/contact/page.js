import { Window } from "@/components/desktop/Window";
import { Contact } from "@/components/landing/Contact";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Contacto — Fora",
  canonicalUrlRelative: "/contact",
});

export default function ContactPage() {
  return (
    <Window title="Contacto">
      <Contact />
    </Window>
  );
}
