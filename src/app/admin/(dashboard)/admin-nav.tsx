import Link from "next/link";
import { logoutAction } from "./logout-action";

const LINKS = [
  { href: "/admin", label: "Leads" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/projects", label: "Proyectos" },
  { href: "/admin/brands", label: "Marcas" },
  { href: "/admin/testimonials", label: "Testimonios" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/sections", label: "Secciones" },
  { href: "/admin/settings", label: "Ajustes" },
];

export default function AdminNav({ email }: { email: string }) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <nav className="flex flex-wrap gap-4 text-sm text-zinc-300">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span>{email}</span>
          <form action={logoutAction}>
            <button type="submit" className="text-red-500 hover:text-red-400">
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
