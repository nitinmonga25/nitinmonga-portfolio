import type { DetectedShape, HierarchyResult } from './types';
import { getHierarchyFeedback } from './feedbackRules';

export function analyzeHierarchy(canvas: HTMLCanvasElement, shapes: DetectedShape[]): HierarchyResult {
  if (shapes.length < 2) {
    return { score: 65, sizeRatio: 1, dominanceRatio: 1, note: 'Too few elements detected for hierarchy analysis.', feedbackItems: getHierarchyFeedback(65) };
  }

  const sorted = [...shapes].sort((a, b) => b.area - a.area);
  const largest       = sorted[0].area;
  const secondLargest = sorted[1]?.area ?? 0;
  const smallest      = sorted[sorted.length - 1].area;

  const sizeRatio       = largest / (smallest + 1);
  const dominanceRatio  = secondLargest > 0 ? largest / secondLargest : 1;

  const sizeScore =
    sizeRatio > 8   ? 100 :
    sizeRatio > 4   ? 85  :
    sizeRatio > 2   ? 65  :
    sizeRatio > 1.5 ? 45  : 25;

  const dominanceScore =
    dominanceRatio > 2.5 ? 90 :
    dominanceRatio > 1.8 ? 75 :
    dominanceRatio > 1.3 ? 55 : 35;

  const topThird   = shapes.filter((s) => s.y < canvas.height / 3);
  const focalBonus = topThird.some((s) => s.area > largest * 0.5) ? 10 : 0;

  const score = Math.min(100, Math.round(sizeScore * 0.5 + dominanceScore * 0.5 + focalBonus));

  return { score, sizeRatio, dominanceRatio, note: '', feedbackItems: getHierarchyFeedback(score) };
}
