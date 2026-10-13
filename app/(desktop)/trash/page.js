import { Window } from "@/components/desktop/Window";
import { Projects, ProjectsToolbar } from "@/components/landing/Projects";
import { getDeadProjects } from "@/models/Project";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Trash — Fora",
  canonicalUrlRelative: "/trash",
});

// Proyectos muertos: los que se dan de alta en /admin con estado "dead". No
// salen en Projects; aquí siguen pudiéndose abrir.
export default async function TrashPage() {
  let projects = [];
  try {
    projects = await getDeadProjects();
  } catch (err) {
    console.error("[trash] No se pudieron cargar proyectos:", err);
  }

  return (
    <Window title="Trash" toolbar={<ProjectsToolbar count={projects.length} trash />}>
      <Projects
        projects={projects}
        title="trash."
        intro="Projects I started, played with for a while, and then killed. Deleted, but you can still look."
        faded
      />
    </Window>
  );
}
