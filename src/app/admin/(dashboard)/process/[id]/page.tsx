import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProcessStepForm from "../ProcessStepForm";
import { updateProcessStep } from "../actions";

export default async function EditProcessStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const step = await db.processStep.findUnique({ where: { id: Number(id) } });
  if (!step) notFound();

  const boundUpdate = updateProcessStep.bind(null, step.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar paso</h1>
      <ProcessStepForm step={step} action={boundUpdate} />
    </div>
  );
}
