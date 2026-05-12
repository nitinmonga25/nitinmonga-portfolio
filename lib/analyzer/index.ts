import type { AnalysisMode, AnalysisResult, SharpPreprocessResult } from './types';
import { analyzeColors } from './colorAnalyzer';
import { analyzeLayout, analyzeLayoutFallback } from './layoutAnalyzer';
import { analyzeHierarchy } from './hierarchyAnalyzer';
import { analyzeTypography } from './typographyAnalyzer';
import { buildAnalysisResult } from './scoringEngine';
import type { RawScores } from './types';

// Yield to browser between heavy steps to avoid "Page Unresponsive"
const yieldToMain = () => new Promise<void>((r) => setTimeout(r, 0));

function loadImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = `data:image/jpeg;base64,${base64}`;
  });
}

// Downsample large images to keep pixel analysis fast
function makeCanvas(img: HTMLImageElement, maxPx = 600): HTMLCanvasElement {
  const scale  = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight));
  const w      = Math.round(img.naturalWidth  * scale);
  const h      = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
  return canvas;
}

export async function runAnalysis(
  meta: SharpPreprocessResult,
  mode: AnalysisMode,
  onStep?: (step: string) => void,
): Promise<AnalysisResult> {
  const t0 = Date.now();

  onStep?.('Loading image…');
  const img = await loadImage(meta.base64);
  await yieldToMain();

  // Use a downsampled canvas (max 600px) for all pixel-level analysis
  const canvas = makeCanvas(img, 600);

  onStep?.('Analysing colors…');
  const colorResult = await analyzeColors(img);
  await yieldToMain();

  onStep?.('Detecting layout…');
  // Use OpenCV if it was preloaded and ready; otherwise use fast fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cvReady = typeof window !== 'undefined' && (window as any).cv && typeof (window as any).cv.imread === 'function';
  let layoutResult;
  if (cvReady) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      layoutResult = analyzeLayout(canvas, (window as any).cv);
    } catch {
      layoutResult = analyzeLayoutFallback(canvas);
    }
  } else {
    layoutResult = analyzeLayoutFallback(canvas);
  }
  await yieldToMain();

  onStep?.('Computing hierarchy…');
  const hierarchyResult = analyzeHierarchy(canvas, layoutResult.shapes);
  await yieldToMain();

  onStep?.('Analysing typography…');
  const typographyResult = analyzeTypography(canvas);
  await yieldToMain();

  onStep?.('Computing final score…');

  const scores: RawScores = {
    color:       colorResult.colorScore,
    spacing:     layoutResult.spacingScore,
    alignment:   layoutResult.alignmentScore,
    consistency: Math.round((layoutResult.consistencyScore + colorResult.consistencyScore) / 2),
    radius:      layoutResult.radiusScore,
    hierarchy:   hierarchyResult.score,
    typography:  typographyResult.score,
  };

  const feedbackMap = {
    color:       colorResult.feedbackItems,
    spacing:     [layoutResult.feedbackItems[0]].filter(Boolean),
    alignment:   [layoutResult.feedbackItems[1]].filter(Boolean),
    consistency: [layoutResult.feedbackItems[2]].filter(Boolean),
    radius:      [layoutResult.feedbackItems[3]].filter(Boolean),
    hierarchy:   hierarchyResult.feedbackItems,
    typography:  typographyResult.feedbackItems,
  };

  return buildAnalysisResult(scores, mode, colorResult.palette, feedbackMap, Date.now() - t0);
}
