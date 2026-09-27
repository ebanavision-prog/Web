import ProjectForm from "../ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nuevo proyecto</h1>
      <ProjectForm action={createProject} />
    </div>
  );
}
