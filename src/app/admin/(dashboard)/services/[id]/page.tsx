import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ServiceForm from "../ServiceForm";
import { updateService } from "../actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await db.service.findUnique({ where: { id: Number(id) } });
  if (!service) notFound();

  const boundUpdate = updateService.bind(null, service.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar servicio</h1>
      <ServiceForm service={service} action={boundUpdate} />
    </div>
  );
}
