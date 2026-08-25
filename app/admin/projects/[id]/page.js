import { notFound } from "next/navigation";
import { getProjectById } from "@/models/Project";
import ProjectForm from "./ProjectForm";

export const dynamic = "force-dynamic";

export default async function ProjectEditor({ params }) {
  const { id } = await params;
  const isNew = id === "new";
  const project = isNew ? null : await getProjectById(id);
  if (!isNew && !project) notFound();

  return <ProjectForm id={id} isNew={isNew} project={project} />;
}
