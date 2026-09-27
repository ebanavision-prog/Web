import ServiceForm from "../ServiceForm";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nuevo servicio</h1>
      <ServiceForm action={createService} />
    </div>
  );
}
