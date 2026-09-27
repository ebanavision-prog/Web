import TestimonialForm from "../TestimonialForm";
import { createTestimonial } from "../actions";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nuevo testimonio</h1>
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
