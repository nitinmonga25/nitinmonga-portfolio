import type { TypographyResult } from './types';
import { getTypographyFeedback } from './feedbackRules';

interface TextRow { y: number; height: number; }

function detectTextRows(imageData: ImageData): TextRow[] {
  const { width, height, data } = imageData;
  const rows: TextRow[] = [];
  let inRow = false;
  let rowStart = 0;

  for (let y = 0; y < height; y += 2) {
    let darkSegments = 0;
    let prevDark = false;
    for (let x = 0; x < width; x += 2) {
      const i = (y * width + x) * 4;
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const isDark = brightness < 140;
      if (isDark && !prevDark) darkSegments++;
      prevDark = isDark;
    }
    const isTextRow = darkSegments > 2 && darkSegments < width / 8;
    if (isTextRow && !inRow)  { inRow = true; rowStart = y; }
    if (!isTextRow && inRow) {
      const h = y - rowStart;
      if (h >= 4 && h <= 80) rows.push({ y: rowStart, height: h });
      inRow = false;
    }
  }
  return rows;
}

export function analyzeTypography(canvas: HTMLCanvasElement): TypographyResult {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const textRows = detectTextRows(imageData);

  if (textRows.length < 2) {
    const score = 65;
    return { score, sizeRatio: 1, note: 'estimated', feedbackItems: getTypographyFeedback(score) };
  }

  const heights   = textRows.map((r) => r.height);
  const maxH      = Math.max(...heights);
  const minH      = Math.min(...heights);
  const sizeRatio = maxH / (minH + 1);

  const hierarchyScore =
    sizeRatio > 3   ? 90 :
    sizeRatio > 2   ? 75 :
    sizeRatio > 1.5 ? 55 : 35;

  const density      = (textRows.length / canvas.height) * 100;
  const densityScore = density < 8 ? 85 : density < 15 ? 65 : 40;

  const score = Math.round(hierarchyScore * 0.6 + densityScore * 0.4);
  return { score, sizeRatio, note: 'estimated', feedbackItems: getTypographyFeedback(score) };
}
