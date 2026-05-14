export type AnalysisMode = 'web_ui' | 'mobile' | 'poster' | 'dashboard';

export type HarmonyType =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'split-complementary'
  | 'chaotic';

export interface DetectedShape {
  x: number;
  y: number;
  w: number;
  h: number;
  area: number;
  aspectRatio: number;
  vertices: number;
  isRect: boolean;
}

export interface ColorResult {
  palette: string[];
  paletteCount: number;
  dominantColor: string;
  wcagScore: number;
  harmonyScore: number;
  consistencyScore: number;
  colorScore: number;
  overColorized: boolean;
  mainContrast: number;
  harmonyType: HarmonyType;
  feedbackItems: string[];
}

export interface LayoutResult {
  shapes: DetectedShape[];
  spacingScore: number;
  alignmentScore: number;
  radiusScore: number;
  consistencyScore: number;
  feedbackItems: string[];
}

export interface HierarchyResult {
  score: number;
  sizeRatio: number;
  dominanceRatio: number;
  note: string;
  feedbackItems: string[];
}

export interface TypographyResult {
  score: number;
  note: string;
  sizeRatio: number;
  feedbackItems: string[];
}

export interface RawScores {
  color: number;
  spacing: number;
  alignment: number;
  consistency: number;
  radius: number;
  hierarchy: number;
  typography: number;
}

export interface AnalysisResult extends RawScores {
  totalScore: number;
  grade: string;
  gradeLabel: string;
  mode: AnalysisMode;
  palette: string[];
  improvements: string[];
  feedbackMap: Record<keyof RawScores, string[]>;
  processingMs: number;
}

export interface SharpPreprocessResult {
  base64: string;
  width: number;
  height: number;
  entropy: number;
  luminance: number;
  contrast: number;
  blurScore: number;
  imageUrl: string;
}
