import { Window } from "@/components/desktop/Window";
import { About } from "@/components/landing/About";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Sobre mí — Fora",
  canonicalUrlRelative: "/about",
});

export default function AboutPage() {
  return (
    <Window title="Sobre mí">
      <About />
    </Window>
  );
}
