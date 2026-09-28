import ProcessStepForm from "../ProcessStepForm";
import { createProcessStep } from "../actions";

export default function NewProcessStepPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nuevo paso</h1>
      <ProcessStepForm action={createProcessStep} />
    </div>
  );
}
