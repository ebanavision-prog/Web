import { getSiteSettings } from "@/lib/content";
import ContactClient from "./ContactClient";

export default async function Contact() {
  const settings = await getSiteSettings();
  return (
    <ContactClient
      whatsappNumber={settings?.whatsappNumber ?? "240222708191"}
      alternativePhone={settings?.alternativePhone ?? null}
      contactEmail={settings?.contactEmail ?? "info@ebanavision.com"}
      address={settings?.address ?? "Bantú, cruce Asonga, Malabo, Guinea Ecuatorial"}
    />
  );
}
