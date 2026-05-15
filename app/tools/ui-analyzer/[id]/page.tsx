import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";
import { UIAnalyzerClient } from "../UIAnalyzerClient";
import type { AnalysisResult, AnalysisMode } from "@/lib/analyzer/types";

export const dynamic = "force-dynamic";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const record = await prisma.uIAnalysis.findUnique({ where: { uuid: params.id } }).catch(() => null);
  if (!record) return { title: "Result not found" };
  const title       = `UI Score ${record.totalScore}/100 — ${record.mode.replace("_", " ")} · Nitin Monga`;
  const description = `This UI scored ${record.totalScore}/100 across color, spacing, alignment, hierarchy and more. Analyzed with the free UI Analyzer tool.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/tools/ui-analyzer/${params.id}/` },
    openGraph: {
      title,
      description,
      url:    `${SITE_URL}/tools/ui-analyzer/${params.id}/`,
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card:  "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function UIAnalyzerSharePage({ params }: Props) {
  const record = await prisma.uIAnalysis.findUnique({ where: { uuid: params.id } }).catch(() => null);
  if (!record) notFound();

  const safeJSON = <T,>(v: string, fallback: T): T => { try { return JSON.parse(v) as T; } catch { return fallback; } };

  const result: AnalysisResult = {
    color:       record.colorScore,
    spacing:     record.spacingScore,
    alignment:   record.alignmentScore,
    consistency: record.consistencyScore,
    radius:      record.radiusScore,
    hierarchy:   record.hierarchyScore,
    typography:  record.typographyScore,
    totalScore:  record.totalScore,
    grade:       record.totalScore >= 90 ? "S" : record.totalScore >= 80 ? "A" : record.totalScore >= 70 ? "B" : record.totalScore >= 60 ? "C" : record.totalScore >= 50 ? "D" : "F",
    gradeLabel:  record.totalScore >= 90 ? "Exceptional — publication ready" : record.totalScore >= 80 ? "Professional quality" : record.totalScore >= 70 ? "Good with minor improvements" : record.totalScore >= 60 ? "Needs work on key areas" : record.totalScore >= 50 ? "Several issues affecting usability" : "Significant redesign recommended",
    mode:        record.mode as AnalysisMode,
    palette:     safeJSON<string[]>(record.palette, []),
    improvements:safeJSON<string[]>(record.improvements, []),
    feedbackMap: {
      color:       safeJSON<string[]>(record.colorFeedback, []),
      spacing:     safeJSON<string[]>(record.spacingFeedback, []),
      alignment:   safeJSON<string[]>(record.alignFeedback, []),
      consistency: safeJSON<string[]>(record.consistFeedback, []),
      radius:      safeJSON<string[]>(record.radiusFeedback, []),
      hierarchy:   safeJSON<string[]>(record.hierarchyFeedback, []),
      typography:  safeJSON<string[]>(record.typographyFeedback, []),
    },
    processingMs: 0,
  };

  return <UIAnalyzerClient initialResult={result} initialUuid={params.id} />;
}
