import type { AnalysisMode, AnalysisResult, SharpPreprocessResult } from './types';
import { analyzeColors } from './colorAnalyzer';
import { analyzeLayout, analyzeLayoutFallback } from './layoutAnalyzer';
import { analyzeHierarchy } from './hierarchyAnalyzer';
import { analyzeTypography } from './typographyAnalyzer';
import { buildAnalysisResult } from './scoringEngine';
import type { RawScores } from './types';

declare global {
  interface Window {
    cv: Record<string, unknown> | undefined;
    cvLoading: boolean | undefined;
  }
}

function loadOpenCV(): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    if (window.cv && typeof (window.cv as Record<string, unknown>).imread === 'function') {
      resolve(window.cv as Record<string, unknown>);
      return;
    }
    if (window.cvLoading) {
      const poll = setInterval(() => {
        if (window.cv && typeof (window.cv as Record<string, unknown>).imread === 'function') {
          clearInterval(poll);
          resolve(window.cv as Record<string, unknown>);
        }
      }, 200);
      setTimeout(() => { clearInterval(poll); reject(new Error('OpenCV timeout')); }, 30000);
      return;
    }
    window.cvLoading = true;
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
    script.async = true;
    script.onload = () => {
      const cv = window.cv as Record<string, unknown> & { onRuntimeInitialized?: () => void };
      if (cv && typeof cv.imread === 'function') {
        resolve(cv);
        return;
      }
      cv.onRuntimeInitialized = () => resolve(window.cv as Record<string, unknown>);
      setTimeout(() => reject(new Error('OpenCV WASM init timeout')), 30000);
    };
    script.onerror = () => reject(new Error('Failed to load OpenCV.js'));
    document.body.appendChild(script);
  });
}

function loadImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = `data:image/jpeg;base64,${base64}`;
  });
}

export async function runAnalysis(
  meta: SharpPreprocessResult,
  mode: AnalysisMode,
  onStep?: (step: string) => void,
): Promise<AnalysisResult> {
  const t0 = Date.now();

  onStep?.('Loading image…');
  const img = await loadImage(meta.base64);

  const canvas = document.createElement('canvas');
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  onStep?.('Analysing colors…');
  const colorResult = await analyzeColors(img);

  onStep?.('Detecting layout…');
  let layoutResult;
  try {
    const cv = await loadOpenCV();
    onStep?.('Running shape detection…');
    layoutResult = analyzeLayout(canvas, cv);
  } catch {
    layoutResult = analyzeLayoutFallback(canvas);
  }

  onStep?.('Computing hierarchy…');
  const hierarchyResult = analyzeHierarchy(canvas, layoutResult.shapes);

  onStep?.('Analysing typography…');
  const typographyResult = analyzeTypography(canvas);

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
