import type { MetaFunction } from "@remix-run/node";
import { Navbar } from "~/components/common/Navbar";
import { Hero } from "~/components/landing/Hero";
import { About } from "~/components/landing/About";
import { Projects } from "~/components/landing/Projects";
import { Contact } from "~/components/landing/Contact";
import { Footer } from "~/components/common/Footer";
export const meta: MetaFunction = () => {
  return [
    { title: "Fora" },
    { name: "description", content: "Portfolio of Fora" },
  ];
};

export default function Index() {
  return (
   <>
   <Navbar />
   <Hero />
   <About />
   <Projects />
   <Contact />
   <Footer />
   </>
  );
}
