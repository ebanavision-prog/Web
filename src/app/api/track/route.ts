import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const path = typeof body.path === "string" ? body.path.slice(0, 255) : null;
    const locale = typeof body.locale === "string" ? body.locale : null;

    if (!path || !locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await db.pageView.create({ data: { path, locale } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
