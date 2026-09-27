import Link from "next/link";
import { db } from "@/lib/db";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteBrand } from "./actions";

export default async function BrandsListPage() {
  const brands = await db.brand.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Marcas</h1>
        <Link
          href="/admin/brands/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + Nueva marca
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-t border-zinc-800">
                <td className="px-4 py-3">{brand.name}</td>
                <td className="px-4 py-3">{brand.published ? "Sí" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/brands/${brand.id}`}
                    className="mr-3 text-blue-400 hover:text-blue-300"
                  >
                    Editar
                  </Link>
                  <DeleteButton action={deleteBrand.bind(null, brand.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
