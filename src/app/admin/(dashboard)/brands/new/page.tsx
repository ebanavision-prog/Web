import BrandForm from "../BrandForm";
import { createBrand } from "../actions";

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Nueva marca</h1>
      <BrandForm action={createBrand} />
    </div>
  );
}
