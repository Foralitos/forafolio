import type { MetaFunction } from "@remix-run/node";
import { Navbar } from "~/components/common/Navbar";
import { Hero } from "~/components/landing/Hero";
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
   </>
  );
}
