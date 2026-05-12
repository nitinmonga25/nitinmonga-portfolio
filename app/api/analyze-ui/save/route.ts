import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      imageUrl: string; mode: string; ipHash: string;
      totalScore: number; colorScore: number; spacingScore: number;
      alignmentScore: number; consistencyScore: number; radiusScore: number;
      hierarchyScore: number; typographyScore: number;
      feedbackMap: Record<string, string[]>;
      improvements: string[]; palette: string[];
    };

    const record = await prisma.uIAnalysis.create({
      data: {
        imageUrl:          body.imageUrl,
        mode:              body.mode,
        ipHash:            body.ipHash,
        totalScore:        body.totalScore,
        colorScore:        body.colorScore,
        spacingScore:      body.spacingScore,
        alignmentScore:    body.alignmentScore,
        consistencyScore:  body.consistencyScore,
        radiusScore:       body.radiusScore,
        hierarchyScore:    body.hierarchyScore,
        typographyScore:   body.typographyScore,
        colorFeedback:     JSON.stringify(body.feedbackMap.color    ?? []),
        spacingFeedback:   JSON.stringify(body.feedbackMap.spacing  ?? []),
        alignFeedback:     JSON.stringify(body.feedbackMap.alignment ?? []),
        consistFeedback:   JSON.stringify(body.feedbackMap.consistency ?? []),
        radiusFeedback:    JSON.stringify(body.feedbackMap.radius   ?? []),
        hierarchyFeedback: JSON.stringify(body.feedbackMap.hierarchy ?? []),
        typographyFeedback:JSON.stringify(body.feedbackMap.typography ?? []),
        improvements:      JSON.stringify(body.improvements),
        palette:           JSON.stringify(body.palette),
      },
    });

    return NextResponse.json({ ok: true, uuid: record.uuid });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Save failed';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
