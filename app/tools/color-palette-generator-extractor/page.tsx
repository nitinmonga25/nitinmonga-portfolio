import type { Metadata } from "next";
import { ColorPaletteGenerator } from "./ColorPaletteGenerator";
import { getContent } from "@/lib/content";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string }>("meta.tools-color-palette");
  const title       = meta?.title       || "Color Palette Generator & Extractor — Free Tool";
  const description = meta?.description || "Generate professional color palettes with 11-shade Tailwind-style scales. Extract colors from any image. Export as CSS variables, Tailwind config, or SCSS. Free tool by Nitin Monga.";
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is the Color Palette Generator free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes — completely free with no account, no watermarks, and no limits on how many palettes you generate or export." } },
    { "@type": "Question", name: "What is a color harmony?", acceptedAnswer: { "@type": "Answer", text: "A color harmony is a set of rules for combining colors in a visually pleasing way. Complementary pairs opposite hues for high contrast. Analogous groups neighboring hues for a calm, cohesive feel. Triadic uses three equally spaced hues for a vibrant, balanced look. Split-complementary is a softer alternative to complementary. Monochromatic uses a single hue at different lightness levels." } },
    { "@type": "Question", name: "What is the 11-shade scale?", acceptedAnswer: { "@type": "Answer", text: "Each base color is expanded into 11 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) — exactly matching the structure used by Tailwind CSS. This gives you a full range from near-white to near-black, ready to use in any design system." } },
    { "@type": "Question", name: "How do I extract colors from an image?", acceptedAnswer: { "@type": "Answer", text: "Switch to the Extract from Image tab, then drop or upload any JPG, PNG, or WebP image. The tool samples the image pixels and returns the most dominant distinct colors in the image." } },
    { "@type": "Question", name: "What export formats are available?", acceptedAnswer: { "@type": "Answer", text: "You can copy your palette as CSS custom properties, a Tailwind CSS config object ready to paste into tailwind.config.js, or SCSS variables. Each format is one-click copy." } },
    { "@type": "Question", name: "Can I use the generated colors in commercial projects?", acceptedAnswer: { "@type": "Answer", text: "Yes — the generated colors are yours to use in any personal or commercial project without attribution." } },
    { "@type": "Question", name: "What is the difference between HEX, RGB, and HSL?", acceptedAnswer: { "@type": "Answer", text: "HEX is the most common format for web — compact and universally supported. RGB is useful when you need to manipulate color channels in CSS or JavaScript. HSL (Hue, Saturation, Lightness) is the most human-readable and great for making programmatic adjustments like lightening or darkening colors." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",  item: "https://nitinmonga.in/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://nitinmonga.in/tools/" },
    { "@type": "ListItem", position: 3, name: "Color Palette Generator", item: "https://nitinmonga.in/tools/color-palette-generator-extractor/" },
  ],
};

export default function ColorPalettePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <ColorPaletteGenerator />
    </>
  );
}
