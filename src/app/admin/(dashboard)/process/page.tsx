import Link from "next/link";
import { db } from "@/lib/db";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteProcessStep } from "./actions";

type LocalizedText = { es?: string };

export default async function ProcessListPage() {
  const steps = await db.processStep.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cómo trabajamos</h1>
        <Link
          href="/admin/process/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + Nuevo paso
        </Link>
      </div>
      <p className="mb-6 text-sm text-zinc-500">
        Los pasos que se muestran en la sección &quot;Cómo trabajamos&quot; de la página de inicio
        (actualmente desactivada — actívala desde Secciones si quieres mostrarla).
      </p>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step) => (
              <tr key={step.id} className="border-t border-zinc-800">
                <td className="px-4 py-3">{(step.title as LocalizedText)?.es ?? "(sin título)"}</td>
                <td className="px-4 py-3">{step.published ? "Sí" : "No"}</td>
                <td className="px-4 py-3">{step.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/process/${step.id}`}
                    className="mr-3 text-blue-400 hover:text-blue-300"
                  >
                    Editar
                  </Link>
                  <DeleteButton action={deleteProcessStep.bind(null, step.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
