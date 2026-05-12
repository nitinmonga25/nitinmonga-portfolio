import type { Metadata } from "next";
import { ColorPaletteGenerator } from "./ColorPaletteGenerator";

export const metadata: Metadata = {
  title: "Color Palette Generator & Extractor — Free Tool",
  description: "Generate professional color palettes with 11-shade Tailwind-style scales. Extract colors from any image. Export as CSS variables, Tailwind config, or SCSS. Free tool by Nitin Monga.",
  openGraph: {
    title: "Color Palette Generator & Extractor — Free Tool by Nitin Monga",
    description: "Pick a base color, choose a harmony, extract colors from images — export a complete design system in seconds.",
  },
};

export default function ColorPalettePage() {
  return <ColorPaletteGenerator />;
}
