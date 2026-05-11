import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id   = parseInt(params.id, 10);
    const body = await req.json();
    const { title, slug, description, longDesc, category, thumbnail, tags, techStack, liveUrl, featured, published, order } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        longDesc: longDesc ?? null,
        category,
        thumbnail: thumbnail ?? "",
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

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
