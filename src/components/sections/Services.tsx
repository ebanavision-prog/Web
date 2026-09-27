import { getServices } from "@/lib/content";
import ServicesClient from "./ServicesClient";

export default async function Services() {
  const services = await getServices();
  if (services.length === 0) return null;
  return <ServicesClient services={services} />;
}
