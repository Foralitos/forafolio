import { getPublishedProjects } from "@/models/Project";
import { calcularCDMXTime } from "@/libs/cdmxTime";
import CDMXTimeProvider from "@/components/common/CDMXTimeProvider";
import { Navbar } from "@/components/common/Navbar";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Projects } from "@/components/landing/Projects";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/common/Footer";

// La grilla de proyectos vive en Mongo y se edita desde /admin: renderizar en
// cada request replica el comportamiento SSR que tenía el loader de Remix y
// evita que el build intente prerenderizar contra la base de datos.
export const dynamic = "force-dynamic";

export default async function Home() {
  // El landing es público y estático salvo la grilla de proyectos. Si la DB
  // está caída no debemos tumbar toda la página: degradamos a [] y dejamos que
  // Hero/About/Contact rendericen igual.
  let projects = [];
  try {
    projects = await getPublishedProjects();
  } catch (err) {
    console.error("[home] No se pudieron cargar proyectos:", err);
  }

  return (
    <CDMXTimeProvider initial={calcularCDMXTime()}>
      <Navbar />
      <Hero />
      <About />
      <Projects projects={projects} />
      <Contact />
      <Footer />
    </CDMXTimeProvider>
  );
}
