import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CONTENT_DEFAULTS } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { startsWith: "content." } },
    });

    const meta = await prisma.siteSetting.findMany({
      where: { key: { startsWith: "meta." } },
    });

    const fromDb: Record<string, unknown> = {};
    for (const s of [...settings, ...meta]) {
      fromDb[s.key] = s.type === "JSON" ? JSON.parse(s.value) : s.value;
    }

    // Merge with defaults — DB values win
    const result: Record<string, unknown> = { ...CONTENT_DEFAULTS, ...fromDb };

    return NextResponse.json({ ok: true, data: result });
  } catch {
    return NextResponse.json({ ok: true, data: CONTENT_DEFAULTS });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { key, value } = body as { key: string; value: unknown };

    if (!key || value === undefined) {
      return NextResponse.json({ ok: false, error: "key and value required" }, { status: 400 });
    }

    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    const type = typeof value === "string" ? "TEXT" : "JSON";

    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: serialized, type },
      update: { value: serialized, type },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
