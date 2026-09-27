import Link from "next/link";
import { db } from "@/lib/db";
import { deleteProject } from "./actions";

type LocalizedText = { es?: string };

export default async function ProjectsListPage() {
  const projects = await db.project.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + Nuevo proyecto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-zinc-800">
                <td className="px-4 py-3">
                  {(project.title as LocalizedText)?.es ?? "(sin título)"}
                </td>
                <td className="px-4 py-3 text-zinc-400">{project.client ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-400">{project.category}</td>
                <td className="px-4 py-3">{project.published ? "Sí" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="mr-3 text-blue-400 hover:text-blue-300"
                  >
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteProject(project.id);
                    }}
                    className="inline"
                  >
                    <button type="submit" className="text-red-500 hover:text-red-400">
                      Eliminar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
