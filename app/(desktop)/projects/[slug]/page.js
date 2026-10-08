import { notFound } from "next/navigation";
import { Window } from "@/components/desktop/Window";
import { ProjectDetail } from "@/components/landing/ProjectDetail";
import { getProjectBySlug } from "@/models/Project";
import { renderMarkdown } from "@/libs/markdown";
import { getSEOTags } from "@/libs/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found — Fora" };

  const description = project.summary || project.description;
  return getSEOTags({
    title: `${project.title} — Fora`,
    description,
    canonicalUrlRelative: `/projects/${project.slug}`,
    openGraph: {
      title: project.title,
      description,
      ...(project.image?.startsWith("http") && { images: [{ url: project.image }] }),
    },
  });
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // El markdown se convierte (y sanitiza) aquí en el servidor; al cliente solo
  // viaja el HTML, no el markdown crudo (con sus comentarios internos).
  const { body, ...resto } = project;
  const html = body ? renderMarkdown(body) : "";

  return (
    <Window title={project.title} backHref="/projects">
      <ProjectDetail project={resto} html={html} />
    </Window>
  );
}
