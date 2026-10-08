import { Window } from "@/components/desktop/Window";
import { About } from "@/components/landing/About";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "About — Fora",
  canonicalUrlRelative: "/about",
});

export default function AboutPage() {
  return (
    <Window title="About">
      <About />
    </Window>
  );
}
