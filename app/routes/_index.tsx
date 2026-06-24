import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Navbar } from "~/components/common/Navbar";
import { Hero } from "~/components/landing/Hero";
import { About } from "~/components/landing/About";
import { Projects } from "~/components/landing/Projects";
import { Contact } from "~/components/landing/Contact";
import { Footer } from "~/components/common/Footer";
import { getPublishedProjects } from "~/models/project.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Fora" },
    { name: "description", content: "Portfolio of Fora" },
  ];
};

export async function loader() {
  const projects = await getPublishedProjects();
  return json({ projects });
}

export default function Index() {
  const { projects } = useLoaderData<typeof loader>();
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Projects projects={projects} />
      <Contact />
      <Footer />
    </>
  );
}
