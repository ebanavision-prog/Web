import AboutStatForm from "../AboutStatForm";
import { createAboutStat } from "../actions";

export default function NewAboutStatPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nueva estadística</h1>
      <AboutStatForm action={createAboutStat} />
    </div>
  );
}
