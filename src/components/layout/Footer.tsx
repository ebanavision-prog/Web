import { getSiteSettings } from "@/lib/content";
import FooterClient from "./FooterClient";

export default async function Footer() {
  const settings = await getSiteSettings();
  return (
    <FooterClient
      contactEmail={settings?.contactEmail ?? "info@ebanavision.com"}
      instagramUrl={settings?.instagramUrl ?? "https://instagram.com/ebanavision"}
      facebookUrl={settings?.facebookUrl ?? "https://facebook.com/ebanavision"}
      tiktokUrl={settings?.tiktokUrl ?? "https://tiktok.com/@ebanavision"}
      youtubeUrl={settings?.youtubeUrl ?? "https://youtube.com/@ebanavision"}
    />
  );
}
