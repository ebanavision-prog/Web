import { getSiteSettings } from "@/lib/content";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const settings = await getSiteSettings();
  return <NavbarClient logoUrl={settings?.logoUrl ?? null} />;
}
