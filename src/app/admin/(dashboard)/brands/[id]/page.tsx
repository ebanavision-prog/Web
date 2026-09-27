import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import BrandForm from "../BrandForm";
import { updateBrand } from "../actions";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await db.brand.findUnique({ where: { id: Number(id) } });
  if (!brand) notFound();

  const boundUpdate = updateBrand.bind(null, brand.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar marca</h1>
      <BrandForm brand={brand} action={boundUpdate} />
    </div>
  );
}
