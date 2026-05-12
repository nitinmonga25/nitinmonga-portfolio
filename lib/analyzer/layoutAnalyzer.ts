import type { DetectedShape, LayoutResult } from './types';
import { getSpacingFeedback, getAlignmentFeedback, getConsistencyFeedback, getRadiusFeedback } from './feedbackRules';

function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.map((v) => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) / arr.length);
}

function computeSpacingScore(shapes: DetectedShape[]): number {
  if (shapes.length < 3) return 70;
  const sorted  = [...shapes].sort((a, b) => a.y - b.y);
  const sortedH = [...shapes].sort((a, b) => a.x - b.x);
  const vGaps: number[] = [];
  const hGaps: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = sorted[i + 1].y - (sorted[i].y + sorted[i].h);
    if (gap > 0 && gap < 200) vGaps.push(gap);
  }
  for (let i = 0; i < sortedH.length - 1; i++) {
    const gap = sortedH[i + 1].x - (sortedH[i].x + sortedH[i].w);
    if (gap > 0 && gap < 200) hGaps.push(gap);
  }
  const all = [...vGaps, ...hGaps];
  if (all.length < 2) return 65;
  const mean = all.reduce((a, b) => a + b, 0) / all.length;
  const cv = stdDev(all) / (mean + 1);
  if (cv < 0.2) return Math.round(90 + (0.2 - cv) / 0.2 * 10);
  if (cv < 0.4) return Math.round(70 + (0.4 - cv) / 0.2 * 19);
  if (cv < 0.6) return Math.round(50 + (0.6 - cv) / 0.2 * 19);
  return Math.max(20, Math.round(50 - cv * 30));
}

function computeAlignmentScore(shapes: DetectedShape[]): number {
  if (shapes.length < 3) return 70;
  const rects = shapes.filter((s) => s.isRect);
  if (rects.length < 2) return 65;
  function countAligned(values: number[], tol = 8): number {
    let max = 0;
    for (const v of values) {
      const cnt = values.filter((x) => Math.abs(x - v) <= tol).length;
      if (cnt > max) max = cnt;
    }
    return max;
  }
  const best = Math.max(
    countAligned(rects.map((r) => r.x)),
    countAligned(rects.map((r) => r.x + r.w)),
    countAligned(rects.map((r) => r.x + r.w / 2)),
  );
  const ratio = best / rects.length;
  if (ratio >= 0.8) return Math.min(100, Math.round(85 + ratio * 15));
  if (ratio >= 0.6) return Math.round(65 + (ratio - 0.6) / 0.2 * 20);
  if (ratio >= 0.4) return Math.round(45 + (ratio - 0.4) / 0.2 * 20);
  return Math.round(20 + ratio * 60);
}

function computeRadiusScore(shapes: DetectedShape[], canvas: HTMLCanvasElement): number {
  const rects = shapes.filter((s) => s.isRect && s.w > 40 && s.h > 20);
  if (rects.length < 2) return 65;
  const ctx = canvas.getContext('2d')!;
  const radii: number[] = [];
  for (const shape of rects.slice(0, 12)) {
    let cornerRound = 0;
    const bgData = ctx.getImageData(Math.max(0, shape.x - 2), Math.max(0, shape.y - 2), 4, 4).data;
    const bgR = bgData[0], bgG = bgData[1], bgB = bgData[2];
    const corners = [
      ctx.getImageData(shape.x, shape.y, 10, 10),
      ctx.getImageData(shape.x + shape.w - 10, shape.y, 10, 10),
      ctx.getImageData(shape.x, shape.y + shape.h - 10, 10, 10),
      ctx.getImageData(shape.x + shape.w - 10, shape.y + shape.h - 10, 10, 10),
    ];
    for (const corner of corners) {
      let bgPixels = 0;
      for (let i = 0; i < corner.data.length; i += 4) {
        if (Math.abs(corner.data[i] - bgR) < 25 && Math.abs(corner.data[i+1] - bgG) < 25 && Math.abs(corner.data[i+2] - bgB) < 25)
          bgPixels++;
      }
      cornerRound += bgPixels / 25;
    }
    radii.push(cornerRound / 4);
  }
  const mean = radii.reduce((a, b) => a + b, 0) / radii.length;
  const cv   = stdDev(radii) / (mean + 1);
  const consistBonus = cv < 0.3 ? 20 : cv < 0.6 ? 10 : 0;
  const modernBonus  = mean > 0.1 ? 10 : 0;
  return Math.min(100, 60 + consistBonus + modernBonus);
}

function computeConsistencyScore(shapes: DetectedShape[]): number {
  if (shapes.length < 3) return 70;
  const rects = shapes.filter((s) => s.isRect);
  if (rects.length < 2) return 65;
  const widths  = rects.map((r) => r.w);
  const heights = rects.map((r) => r.h);
  const wCV = stdDev(widths)  / (widths.reduce((a, b) => a + b, 0)  / widths.length  + 1);
  const hCV = stdDev(heights) / (heights.reduce((a, b) => a + b, 0) / heights.length + 1);
  const cv = (wCV + hCV) / 2;
  if (cv < 0.2) return 90;
  if (cv < 0.4) return 75;
  if (cv < 0.6) return 55;
  return 35;
}

export function analyzeLayout(canvas: HTMLCanvasElement, cv: Record<string, unknown>): LayoutResult {
  // High contour count = artwork/illustration, reduce confidence
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cvAny = cv as any;
  const src       = cvAny.imread(canvas);
  const gray      = new cvAny.Mat();
  const blurred   = new cvAny.Mat();
  const edges     = new cvAny.Mat();
  const contours  = new cvAny.MatVector();
  const hierarchy = new cvAny.Mat();

  cvAny.cvtColor(src, gray, cvAny.COLOR_RGBA2GRAY);
  cvAny.GaussianBlur(gray, blurred, new cvAny.Size(5, 5), 0);
  cvAny.Canny(blurred, edges, 50, 150);
  const kernel = cvAny.getStructuringElement(cvAny.MORPH_RECT, new cvAny.Size(3, 3));
  cvAny.dilate(edges, edges, kernel);
  cvAny.findContours(edges, contours, hierarchy, cvAny.RETR_EXTERNAL, cvAny.CHAIN_APPROX_SIMPLE);

  const imgArea = canvas.width * canvas.height;
  const shapes: DetectedShape[] = [];
  const count = contours.size() as number;

  for (let i = 0; i < count; i++) {
    const cnt  = contours.get(i);
    const area = cvAny.contourArea(cnt) as number;
    if (area < imgArea * 0.005 || area > imgArea * 0.80) { cnt.delete(); continue; }
    const rect  = cvAny.boundingRect(cnt);
    const approx = new cvAny.Mat();
    cvAny.approxPolyDP(cnt, approx, 3, true);
    shapes.push({
      x: rect.x as number, y: rect.y as number,
      w: rect.width as number, h: rect.height as number,
      area, aspectRatio: (rect.width as number) / ((rect.height as number) || 1),
      vertices: approx.rows as number,
      isRect: (approx.rows as number) >= 4 && (approx.rows as number) <= 6,
    });
    approx.delete();
    cnt.delete();
  }

  // Cleanup
  for (const m of [src, gray, blurred, edges, contours, hierarchy, kernel])
    m.delete();

  const spacingScore     = computeSpacingScore(shapes);
  const alignmentScore   = computeAlignmentScore(shapes);
  const radiusScore      = computeRadiusScore(shapes, canvas);
  const consistencyScore = computeConsistencyScore(shapes);

  return {
    shapes, spacingScore, alignmentScore, radiusScore, consistencyScore,
    feedbackItems: [
      ...getSpacingFeedback(spacingScore),
      ...getAlignmentFeedback(alignmentScore),
      ...getConsistencyFeedback(consistencyScore),
      ...getRadiusFeedback(radiusScore),
    ],
  };
}

// Fallback when OpenCV not available
export function analyzeLayoutFallback(canvas: HTMLCanvasElement): LayoutResult {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  // Simple edge-count heuristic
  let edges = 0;
  for (let y = 1; y < height - 1; y += 4)
    for (let x = 1; x < width - 1; x += 4) {
      const i = (y * width + x) * 4;
      const j = ((y + 1) * width + x) * 4;
      const diff = Math.abs(data[i] - data[j]) + Math.abs(data[i+1] - data[j+1]) + Math.abs(data[i+2] - data[j+2]);
      if (diff > 30) edges++;
    }
  const edgeDensity = edges / (width * height / 16);
  const base = edgeDensity > 0.15 ? 72 : edgeDensity > 0.08 ? 78 : 65;
  return {
    shapes: [], spacingScore: base, alignmentScore: base, radiusScore: 65, consistencyScore: base,
    feedbackItems: ['Layout analysis used fallback mode — OpenCV unavailable. Scores are estimated.'],
  };
}
