export const FEEDBACK_RULES = {
  color: {
    wcag: {
      high:   'Text contrast meets WCAG AAA standard (7:1+). Excellent readability for all users.',
      medium: 'Text contrast meets WCAG AA (4.5:1). Consider improving dark-mode or small-text contrast.',
      low:    'Contrast ratio is below WCAG AA. Some text may be unreadable for users with low vision. Aim for 4.5:1 minimum.',
    },
    harmony: {
      monochromatic:       'Monochromatic palette — clean and focused. Use tints and shades to add depth without visual noise.',
      analogous:           'Analogous colors create a harmonious, natural feel. Well-balanced choice.',
      complementary:       'Complementary colors create strong contrast and energy. Ensure the dominant/accent ratio is roughly 70/30.',
      triadic:             'Triadic palette is vibrant and balanced. Keep one hue dominant to avoid equal competition.',
      'split-complementary': 'Split-complementary palette offers contrast without the tension of direct complements.',
      chaotic:             'Color palette lacks harmony. Hues are too spread — limit accent colors to 2–3 from the same family.',
    },
    overColor:   'Too many saturated accent colors detected. Reduce to 2–3 accent colors maximum for a professional, focused look.',
    clean:       'Clean, restrained color palette. Professional and easy to read.',
    darkMode:    'Dark background detected. Ensure text-on-dark contrast meets WCAG AA (4.5:1).',
  },
  spacing: {
    high:   'Spacing is highly consistent. Elements breathe well and follow a clear visual rhythm.',
    medium: 'Spacing is mostly consistent with minor variation. Consider aligning gaps to an 8px grid (8, 16, 24, 32px).',
    low:    'Spacing is inconsistent across elements. Gaps vary significantly — this breaks visual rhythm. Adopt a strict 8px spacing scale.',
  },
  alignment: {
    high:   'Strong grid alignment. Elements share precise left, right, and center axes.',
    medium: 'Most elements align well. A few appear slightly off-grid — snap them to the nearest 4px unit.',
    low:    'Alignment issues detected. Elements do not share consistent axes. Use a 12-column grid system.',
  },
  consistency: {
    high:   'Highly consistent UI — corner rounding, spacing, and colors repeat predictably across all elements.',
    medium: 'Mostly consistent. Some variation in corner rounding or spacing detected. Standardise your design tokens.',
    low:    'Inconsistency detected across corner rounding, spacing, or colors. Define and reuse a small set of design tokens.',
  },
  radius: {
    high:   'Corner rounding is consistent and modern. The rounded style reads as polished and cohesive.',
    medium: 'Corner rounding varies between elements. Pick one radius scale (e.g., 4px / 8px / 16px) and apply it consistently.',
    low:    'Inconsistent or absent corner rounding detected. Decide on a style (sharp, soft, or pill) and apply it uniformly.',
  },
  hierarchy: {
    high:   'Strong visual hierarchy — a clear focal point guides the eye naturally through the layout.',
    medium: 'Moderate hierarchy. The primary element stands out but secondary elements compete for attention.',
    low:    'Weak visual hierarchy. Elements are too similar in size — make the primary element 3–4× larger than supporting content.',
  },
  typography: {
    high:   'Clear typographic hierarchy detected. Heading and body size contrast guides reading flow well.',
    medium: 'Typographic contrast is present but could be stronger. Increase the size gap between headings and body text.',
    low:    'Limited typographic hierarchy detected. Use at least 2 distinct text sizes — a heading (24px+) and body (14–16px).',
    note:   'Measures text-region size contrast — font names are not detectable from screenshots.',
  },
};

export function getColorFeedback(
  wcagScore: number,
  harmonyType: string,
  overColorized: boolean,
  mainContrast: number,
  isDark: boolean,
): string[] {
  const items: string[] = [];
  if (wcagScore >= 75)     items.push(FEEDBACK_RULES.color.wcag.high);
  else if (wcagScore >= 50) items.push(FEEDBACK_RULES.color.wcag.medium);
  else                      items.push(FEEDBACK_RULES.color.wcag.low.replace('{ratio}', mainContrast.toFixed(1)));

  const hKey = harmonyType as keyof typeof FEEDBACK_RULES.color.harmony;
  if (FEEDBACK_RULES.color.harmony[hKey]) items.push(FEEDBACK_RULES.color.harmony[hKey]);

  if (overColorized) items.push(FEEDBACK_RULES.color.overColor);
  if (isDark)        items.push(FEEDBACK_RULES.color.darkMode);
  return items;
}

export function getSpacingFeedback(score: number): string[] {
  if (score >= 75) return [FEEDBACK_RULES.spacing.high];
  if (score >= 50) return [FEEDBACK_RULES.spacing.medium];
  return [FEEDBACK_RULES.spacing.low];
}

export function getAlignmentFeedback(score: number): string[] {
  if (score >= 75) return [FEEDBACK_RULES.alignment.high];
  if (score >= 50) return [FEEDBACK_RULES.alignment.medium];
  return [FEEDBACK_RULES.alignment.low];
}

export function getConsistencyFeedback(score: number): string[] {
  if (score >= 75) return [FEEDBACK_RULES.consistency.high];
  if (score >= 50) return [FEEDBACK_RULES.consistency.medium];
  return [FEEDBACK_RULES.consistency.low];
}

export function getRadiusFeedback(score: number): string[] {
  if (score >= 75) return [FEEDBACK_RULES.radius.high];
  if (score >= 50) return [FEEDBACK_RULES.radius.medium];
  return [FEEDBACK_RULES.radius.low];
}

export function getHierarchyFeedback(score: number): string[] {
  if (score >= 75) return [FEEDBACK_RULES.hierarchy.high];
  if (score >= 50) return [FEEDBACK_RULES.hierarchy.medium];
  return [FEEDBACK_RULES.hierarchy.low];
}

export function getTypographyFeedback(score: number): string[] {
  const base = score >= 75
    ? FEEDBACK_RULES.typography.high
    : score >= 50
    ? FEEDBACK_RULES.typography.medium
    : FEEDBACK_RULES.typography.low;
  return [base, FEEDBACK_RULES.typography.note];
}
