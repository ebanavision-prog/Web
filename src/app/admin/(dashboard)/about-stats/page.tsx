import Link from "next/link";
import { db } from "@/lib/db";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteAboutStat } from "./actions";

type LocalizedText = { es?: string };

export default async function AboutStatsListPage() {
  const stats = await db.aboutStat.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Estadísticas de &quot;Nosotros&quot;</h1>
        <Link
          href="/admin/about-stats/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + Nueva estadística
        </Link>
      </div>
      <p className="mb-6 text-sm text-zinc-500">
        Los números (250+ Proyectos, 7+ Años...) que se muestran en la sección Nosotros.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Número</th>
              <th className="px-4 py-3">Etiqueta</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.id} className="border-t border-zinc-800">
                <td className="px-4 py-3 font-medium">{stat.value}</td>
                <td className="px-4 py-3">{(stat.label as LocalizedText)?.es ?? "—"}</td>
                <td className="px-4 py-3">{stat.published ? "Sí" : "No"}</td>
                <td className="px-4 py-3">{stat.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/about-stats/${stat.id}`}
                    className="mr-3 text-blue-400 hover:text-blue-300"
                  >
                    Editar
                  </Link>
                  <DeleteButton action={deleteAboutStat.bind(null, stat.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
