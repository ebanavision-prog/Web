import { db } from "@/lib/db";

const LOCALE_LABELS: Record<string, string> = { es: "Español", en: "English", fr: "Français" };

function startOfDaysAgo(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d;
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function AnalyticsPage() {
  const todayStart = startOfDaysAgo(0);
  const sevenDaysAgo = startOfDaysAgo(7);
  const thirtyDaysAgo = startOfDaysAgo(30);
  const fourteenDaysAgo = startOfDaysAgo(13);

  const [totalViews, viewsToday, views7d, views30d, topPages, byLocale, recentViews] =
    await Promise.all([
      db.pageView.count(),
      db.pageView.count({ where: { createdAt: { gte: todayStart } } }),
      db.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      db.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      db.pageView.groupBy({
        by: ["path"],
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 10,
      }),
      db.pageView.groupBy({
        by: ["locale"],
        _count: { locale: true },
      }),
      db.pageView.findMany({
        where: { createdAt: { gte: fourteenDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

  const dailyMap = new Map<string, number>();
  for (const view of recentViews) {
    const key = dayKey(view.createdAt);
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
  }
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = startOfDaysAgo(13 - i);
    const key = dayKey(d);
    return { key, label: d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }), count: dailyMap.get(key) ?? 0 };
  });
  const maxDaily = Math.max(1, ...days.map((d) => d.count));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Estadísticas del sitio</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Hoy", value: viewsToday },
          { label: "Últimos 7 días", value: views7d },
          { label: "Últimos 30 días", value: views30d },
          { label: "Total histórico", value: totalViews },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-2xl font-semibold">{stat.value}</div>
            <div className="text-sm text-zinc-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="mb-4 text-lg font-medium">Visitas por día (últimos 14 días)</h2>
        {totalViews === 0 ? (
          <p className="text-sm text-zinc-500">Aún no hay visitas registradas.</p>
        ) : (
          <div className="flex items-end gap-2" style={{ height: 140 }}>
            {days.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-brand-red"
                  style={{ height: `${(d.count / maxDaily) * 100}px`, minHeight: d.count > 0 ? 4 : 0 }}
                  title={`${d.count} visitas`}
                />
                <span className="text-[10px] text-zinc-500">{d.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="mb-4 text-lg font-medium">Páginas más visitadas</h2>
          {topPages.length === 0 ? (
            <p className="text-sm text-zinc-500">Sin datos aún.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {topPages.map((row) => (
                <li key={row.path} className="flex justify-between gap-4">
                  <span className="truncate text-zinc-300">{row.path}</span>
                  <span className="text-zinc-500">{row._count.path}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="mb-4 text-lg font-medium">Visitas por idioma</h2>
          {byLocale.length === 0 ? (
            <p className="text-sm text-zinc-500">Sin datos aún.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {byLocale
                .sort((a, b) => b._count.locale - a._count.locale)
                .map((row) => (
                  <li key={row.locale} className="flex justify-between gap-4">
                    <span className="text-zinc-300">{LOCALE_LABELS[row.locale] ?? row.locale}</span>
                    <span className="text-zinc-500">{row._count.locale}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
