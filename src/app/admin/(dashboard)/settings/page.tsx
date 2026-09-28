import { db } from "@/lib/db";
import LocaleTabsField from "@/components/admin/LocaleTabsField";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { updateSettings } from "./actions";

type LocalizedText = { es?: string; en?: string; fr?: string };

export default async function SettingsPage() {
  const settings = await db.siteSetting.findUnique({ where: { id: 1 } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Ajustes del sitio</h1>
      <form action={updateSettings} className="max-w-2xl">
        <h2 className="mb-3 mt-2 text-lg font-medium text-zinc-300">Hero</h2>
        <LocaleTabsField
          label="Título línea 1"
          name="heroTitle1"
          defaultValues={(settings?.heroTitle1 as LocalizedText) ?? {}}
        />
        <LocaleTabsField
          label="Título línea 2"
          name="heroTitle2"
          defaultValues={(settings?.heroTitle2 as LocalizedText) ?? {}}
        />
        <LocaleTabsField
          label="Título línea 3"
          name="heroTitle3"
          defaultValues={(settings?.heroTitle3 as LocalizedText) ?? {}}
        />
        <LocaleTabsField
          label="Descripción del hero"
          name="heroDescription"
          defaultValues={(settings?.heroDescription as LocalizedText) ?? {}}
          multiline
        />

        <div className="mb-5">
          <label className="mb-1 block text-sm text-zinc-400">
            Video del hero (solo el ID de YouTube)
          </label>
          <input
            type="text"
            name="heroVideoYoutubeId"
            defaultValue={settings?.heroVideoYoutubeId ?? ""}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
          />
        </div>

        <ImageUploadField name="logoUrl" label="Logo" defaultValue={settings?.logoUrl} />

        <h2 className="mb-3 mt-8 text-lg font-medium text-zinc-300">Apariencia</h2>
        <div className="mb-5">
          <label className="mb-1 block text-sm text-zinc-400">Tipografía de títulos</label>
          <select
            name="fontPairing"
            defaultValue={settings?.fontPairing ?? "bold"}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
          >
            <option value="bold">Bold (a juego con el logo)</option>
            <option value="editorial">Editorial (serif elegante)</option>
          </select>
        </div>

        <h2 className="mb-3 mt-8 text-lg font-medium text-zinc-300">Contacto</h2>
        {[
          ["whatsappNumber", "WhatsApp (solo dígitos con código de país)"],
          ["alternativePhone", "Teléfono alternativo"],
          ["contactEmail", "Email de contacto"],
          ["address", "Dirección"],
        ].map(([name, label]) => (
          <div className="mb-5" key={name}>
            <label className="mb-1 block text-sm text-zinc-400">{label}</label>
            <input
              type="text"
              name={name}
              defaultValue={(settings?.[name as keyof typeof settings] as string) ?? ""}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
            />
          </div>
        ))}

        <h2 className="mb-3 mt-8 text-lg font-medium text-zinc-300">Redes sociales</h2>
        {[
          ["instagramUrl", "Instagram"],
          ["facebookUrl", "Facebook"],
          ["tiktokUrl", "TikTok"],
          ["youtubeUrl", "YouTube"],
        ].map(([name, label]) => (
          <div className="mb-5" key={name}>
            <label className="mb-1 block text-sm text-zinc-400">{label}</label>
            <input
              type="text"
              name={name}
              defaultValue={(settings?.[name as keyof typeof settings] as string) ?? ""}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
            />
          </div>
        ))}

        <h2 className="mb-3 mt-8 text-lg font-medium text-zinc-300">SEO y extras</h2>
        <LocaleTabsField
          label="Meta descripción (SEO)"
          name="metaDescription"
          defaultValues={(settings?.metaDescription as LocalizedText) ?? {}}
          multiline
        />
        <div className="mb-5">
          <label className="mb-1 block text-sm text-zinc-400">
            Link de recurso gratuito (PDF). Vacío = esa sección no se muestra
          </label>
          <input
            type="text"
            name="freeResourceUrl"
            defaultValue={settings?.freeResourceUrl ?? ""}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
