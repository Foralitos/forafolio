import { Window } from "@/components/desktop/Window";
import { Contact } from "@/components/landing/Contact";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Contact — Fora",
  canonicalUrlRelative: "/contact",
});

export default function ContactPage() {
  return (
    <Window title="Contact">
      <Contact />
    </Window>
  );
}
