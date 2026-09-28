import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import AboutStatForm from "../AboutStatForm";
import { updateAboutStat } from "../actions";

export default async function EditAboutStatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stat = await db.aboutStat.findUnique({ where: { id: Number(id) } });
  if (!stat) notFound();

  const boundUpdate = updateAboutStat.bind(null, stat.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar estadística</h1>
      <AboutStatForm stat={stat} action={boundUpdate} />
    </div>
  );
}
