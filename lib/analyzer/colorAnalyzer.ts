import type { ColorResult, HarmonyType } from './types';
import { getColorFeedback } from './feedbackRules';

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.min(255, v).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
  else if (max === gg) h = ((bb - rr) / d + 2) / 6;
  else h = ((rr - gg) / d + 4) / 6;
  return [h, s, l];
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function getWCAGContrast(c1: [number, number, number], c2: [number, number, number]): number {
  const l1 = getRelativeLuminance(...c1);
  const l2 = getRelativeLuminance(...c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function detectHarmony(hslColors: [number, number, number][]): HarmonyType {
  const hues = hslColors.filter(([, s]) => s > 0.2).map(([h]) => h * 360);
  if (hues.length < 2) return 'monochromatic';
  const diffs: number[] = [];
  for (let i = 0; i < hues.length; i++)
    for (let j = i + 1; j < hues.length; j++) {
      let d = Math.abs(hues[i] - hues[j]);
      if (d > 180) d = 360 - d;
      diffs.push(d);
    }
  const maxDiff = Math.max(...diffs);
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  if (maxDiff < 30)  return 'analogous';
  if (maxDiff > 150 && maxDiff < 210) return 'complementary';
  if (avgDiff > 100 && avgDiff < 130) return 'triadic';
  if (diffs.filter((d) => d > 60).length > diffs.length * 0.6) return 'chaotic';
  return 'split-complementary';
}

// colorthief v3 ColorImpl shape
interface CT3Color {
  rgb(): { r: number; g: number; b: number };
  hex(): string;
  hsl(): { h: number; s: number; l: number };
}

export async function analyzeColors(img: HTMLImageElement): Promise<ColorResult> {
  // colorthief v3: functional async API, returns ColorImpl objects (not [r,g,b] tuples)
  // getPalette(source, options) — colorCount is in the options object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { getPalette } = await import('colorthief') as any;

  const colors: CT3Color[] = (await getPalette(img, { colorCount: 8 })) ?? [];
  if (colors.length === 0) throw new Error('colorthief returned empty palette');

  // Extract hex strings and RGB tuples
  const palette    = colors.map((c) => c.hex());
  const rgbColors  = colors.map((c) => { const { r, g, b } = c.rgb(); return [r, g, b] as [number,number,number]; });
  const dominant   = rgbColors[0];

  // WCAG contrast between lightest and darkest
  const byLum  = [...rgbColors].sort((a, b) => getRelativeLuminance(...a) - getRelativeLuminance(...b));
  const lightest = byLum[byLum.length - 1];
  const darkest  = byLum[0];
  const mainContrast = getWCAGContrast(lightest, darkest);

  const wcagScore =
    mainContrast >= 7   ? 100 :
    mainContrast >= 4.5 ? 75  :
    mainContrast >= 3   ? 50  : 20;

  const hslColors   = rgbColors.map(([r, g, b]) => rgbToHsl(r, g, b));
  const harmonyType = detectHarmony(hslColors);
  const harmonyScore = harmonyType !== 'chaotic' ? 80 : 35;

  const accentColors  = hslColors.filter(([, s, l]) => s > 0.3 && l > 0.15 && l < 0.85);
  const overColorized = accentColors.length > 5;

  const consistencyScore =
    palette.length <= 3 ? 95 :
    palette.length <= 5 ? 80 :
    palette.length <= 7 ? 60 : 35;

  const colorScore = Math.round(wcagScore * 0.4 + harmonyScore * 0.35 + consistencyScore * 0.25);
  const isDark     = getRelativeLuminance(...dominant) < 0.15;
  const feedbackItems = getColorFeedback(wcagScore, harmonyType, overColorized, mainContrast, isDark);

  return {
    palette, paletteCount: palette.length,
    dominantColor: rgbToHex(...dominant),
    wcagScore, harmonyScore, consistencyScore, colorScore,
    overColorized, mainContrast, harmonyType, feedbackItems,
  };
}
