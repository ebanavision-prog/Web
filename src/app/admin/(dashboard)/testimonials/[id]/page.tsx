import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import TestimonialForm from "../TestimonialForm";
import { updateTestimonial } from "../actions";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await db.testimonial.findUnique({ where: { id: Number(id) } });
  if (!testimonial) notFound();

  const boundUpdate = updateTestimonial.bind(null, testimonial.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Editar testimonio</h1>
      <TestimonialForm testimonial={testimonial} action={boundUpdate} />
    </div>
  );
}
