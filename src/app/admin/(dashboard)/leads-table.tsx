"use client";

import type { Lead, LeadStatus } from "@prisma/client";
import { useState, useTransition } from "react";
import { updateLeadStatus, deleteLead } from "./actions";

const STATUS_OPTIONS: LeadStatus[] = ["NUEVO", "CONTACTADO"];

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<number | null>(null);

  if (leads.length === 0) {
    return <p className="text-zinc-500">No hay leads registrados aún.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-900 text-zinc-400">
          <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Contacto</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-zinc-800">
              <td className="px-4 py-3 text-zinc-400">
                {new Date(lead.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                {lead.name ?? "—"} <span className="text-zinc-500">({lead.contact})</span>
              </td>
              <td className="px-4 py-3 text-zinc-400">{lead.type}</td>
              <td className="px-4 py-3">
                <select
                  value={lead.status}
                  disabled={isPending && pendingId === lead.id}
                  onChange={(e) => {
                    setPendingId(lead.id);
                    startTransition(() => {
                      updateLeadStatus(lead.id, e.target.value as LeadStatus);
                    });
                  }}
                  className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status === "NUEVO" ? "Nuevo" : "Contactado"}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => {
                    if (!confirm("¿Eliminar este lead?")) return;
                    setPendingId(lead.id);
                    startTransition(() => {
                      deleteLead(lead.id);
                    });
                  }}
                  className="text-red-500 hover:text-red-400"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
