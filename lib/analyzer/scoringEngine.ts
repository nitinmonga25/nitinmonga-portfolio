import type { AnalysisMode, RawScores, AnalysisResult } from './types';

const WEIGHTS: Record<AnalysisMode, Record<keyof RawScores, number>> = {
  web_ui: {
    color: 0.15, spacing: 0.18, alignment: 0.18,
    consistency: 0.15, radius: 0.08, hierarchy: 0.14, typography: 0.12,
  },
  mobile: {
    color: 0.12, spacing: 0.20, alignment: 0.20,
    consistency: 0.15, radius: 0.10, hierarchy: 0.13, typography: 0.10,
  },
  poster: {
    color: 0.28, spacing: 0.10, alignment: 0.12,
    consistency: 0.10, radius: 0.05, hierarchy: 0.25, typography: 0.10,
  },
  dashboard: {
    color: 0.12, spacing: 0.18, alignment: 0.22,
    consistency: 0.18, radius: 0.06, hierarchy: 0.12, typography: 0.12,
  },
  logo: {
    color: 0.30, spacing: 0.05, alignment: 0.10,
    consistency: 0.15, radius: 0.10, hierarchy: 0.25, typography: 0.05,
  },
};

const GRADE_MAP: { min: number; grade: string; label: string }[] = [
  { min: 90, grade: 'S', label: 'Exceptional — publication ready'       },
  { min: 80, grade: 'A', label: 'Professional quality'                  },
  { min: 70, grade: 'B', label: 'Good with minor improvements needed'   },
  { min: 60, grade: 'C', label: 'Needs work on key areas'               },
  { min: 50, grade: 'D', label: 'Several issues affecting usability'     },
  { min:  0, grade: 'F', label: 'Significant redesign recommended'       },
];

export function computeFinalScore(scores: RawScores, mode: AnalysisMode): number {
  const w = WEIGHTS[mode];
  return Math.round(
    scores.color       * w.color +
    scores.spacing     * w.spacing +
    scores.alignment   * w.alignment +
    scores.consistency * w.consistency +
    scores.radius      * w.radius +
    scores.hierarchy   * w.hierarchy +
    scores.typography  * w.typography,
  );
}

export function getGrade(score: number): { grade: string; label: string } {
  return GRADE_MAP.find((g) => score >= g.min) ?? GRADE_MAP[GRADE_MAP.length - 1];
}

export function getTopImprovements(
  scores: RawScores,
  feedbackMap: Record<keyof RawScores, string[]>,
): string[] {
  return (Object.entries(scores) as [keyof RawScores, number][])
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([key]) => feedbackMap[key]?.[0] ?? '')
    .filter(Boolean);
}

export function buildAnalysisResult(
  scores: RawScores,
  mode: AnalysisMode,
  palette: string[],
  feedbackMap: Record<keyof RawScores, string[]>,
  processingMs: number,
): AnalysisResult {
  const totalScore = computeFinalScore(scores, mode);
  const { grade, label: gradeLabel } = getGrade(totalScore);
  const improvements = getTopImprovements(scores, feedbackMap);
  return { ...scores, totalScore, grade, gradeLabel, mode, palette, improvements, feedbackMap, processingMs };
}
