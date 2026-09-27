import { db } from "@/lib/db";
import SectionsList from "./SectionsList";

export default async function SectionsPage() {
  const sections = await db.section.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Secciones de la página</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Activa, desactiva o reordena las secciones opcionales de la página de inicio.
        Los cambios se reflejan de inmediato en el sitio publicado.
      </p>
      <SectionsList sections={sections} />
    </div>
  );
}
