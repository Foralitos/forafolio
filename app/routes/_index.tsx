import type { MetaFunction } from "@remix-run/node";
import { Navbar } from "~/components/common/Navbar";

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
   </>
  );
}
