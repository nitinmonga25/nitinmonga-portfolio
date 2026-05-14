import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ ok: true, data: projects });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, description, longDesc, category, thumbnail, images, tags, techStack, liveUrl, featured, published, order } = body;

    if (!title || !slug) {
      return NextResponse.json({ ok: false, error: "title and slug required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description: description ?? "",
        longDesc: longDesc ?? null,
        category: category ?? "Web Design",
        thumbnail: thumbnail ?? "",
        images: images?.length ? JSON.stringify(images) : null,
        tags: tags ? JSON.stringify(tags) : null,
        techStack: techStack?.length ? JSON.stringify(techStack) : null,
        liveUrl: liveUrl ?? null,
        featured: featured ?? false,
        published: published ?? false,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ ok: true, data: project });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
