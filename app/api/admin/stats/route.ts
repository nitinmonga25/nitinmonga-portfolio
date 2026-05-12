import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [projectCount, postCount, messageCount, unreadCount, recentMessages] = await Promise.all([
      prisma.project.count({ where: { published: true } }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, service: true, createdAt: true, read: true },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      data: { projectCount, postCount, messageCount, unreadCount, recentMessages },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
