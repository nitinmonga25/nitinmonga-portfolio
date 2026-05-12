import type { Metadata } from "next";
import { ColorPaletteGenerator } from "./ColorPaletteGenerator";

export const metadata: Metadata = {
  title: "Color Palette Generator — Free Tool",
  description: "Generate professional color palettes with 11-shade Tailwind-style scales. Export as CSS variables, Tailwind config, or SCSS. Free tool by Nitin Monga.",
  openGraph: {
    title: "Color Palette Generator — Free Tool by Nitin Monga",
    description: "Pick a base color, choose a harmony, export a complete design system in seconds.",
  },
};

export default function ColorPalettePage() {
  return <ColorPaletteGenerator />;
}
