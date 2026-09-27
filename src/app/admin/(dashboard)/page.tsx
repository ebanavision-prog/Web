import { db } from "@/lib/db";
import LeadsTable from "./leads-table";

export default async function AdminLeadsPage() {
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Gestión de leads</h1>
      <LeadsTable leads={leads} />
    </div>
  );
}
