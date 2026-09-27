import { getSiteSettings } from "@/lib/content";
import FloatingContactClient from "./FloatingContactClient";

export default async function FloatingContact() {
  const settings = await getSiteSettings();
  return <FloatingContactClient whatsappNumber={settings?.whatsappNumber ?? "240222708191"} />;
}
