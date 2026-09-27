import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProjectForm from "../ProjectForm";
import { updateProject } from "../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id: Number(id) } });
  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, project.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar proyecto</h1>
      <ProjectForm project={project} action={boundUpdate} />
    </div>
  );
}
