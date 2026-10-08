import { Window } from "@/components/desktop/Window";
import { Projects } from "@/components/landing/Projects";
import { getPublishedProjects } from "@/models/Project";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Proyectos — Fora",
  canonicalUrlRelative: "/projects",
});

export default async function ProjectsPage() {
  // La grilla vive en Mongo y se edita desde /admin. Si la DB está caída la
  // ventana abre vacía en vez de tumbar el escritorio.
  let projects = [];
  try {
    projects = await getPublishedProjects();
  } catch (err) {
    console.error("[projects] No se pudieron cargar proyectos:", err);
  }

  return (
    <Window title="Proyectos">
      <Projects projects={projects} />
    </Window>
  );
}
