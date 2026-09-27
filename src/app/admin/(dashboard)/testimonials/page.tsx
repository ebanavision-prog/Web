import Link from "next/link";
import { db } from "@/lib/db";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteTestimonial } from "./actions";

export default async function TestimonialsListPage() {
  const testimonials = await db.testimonial.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Testimonios</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          + Nuevo testimonio
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
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="border-t border-zinc-800">
                <td className="px-4 py-3">{testimonial.name}</td>
                <td className="px-4 py-3">{testimonial.published ? "Sí" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}`}
                    className="mr-3 text-blue-400 hover:text-blue-300"
                  >
                    Editar
                  </Link>
                  <DeleteButton action={deleteTestimonial.bind(null, testimonial.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
