import { Window } from "@/components/desktop/Window";
import { Welcome } from "@/components/desktop/Welcome";
import { getPublishedProjects } from "@/models/Project";

export default async function Home() {
  // "What I'm building" muestra los primeros proyectos del admin. Si Mongo
  // falla, la sección simplemente no aparece.
  let projects = [];
  try {
    projects = await getPublishedProjects();
  } catch (err) {
    console.error("[home] No se pudieron cargar proyectos:", err);
  }

  return (
    <Window title="Welcome">
      <Welcome projects={projects.slice(0, 3)} />
    </Window>
  );
}
