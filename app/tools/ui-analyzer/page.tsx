import type { Metadata } from "next";
import { UIAnalyzerClient } from "./UIAnalyzerClient";

export const metadata: Metadata = {
  title: "UI Analyzer — Free Design Score Tool",
  description: "Upload any UI screenshot and get a professional score for spacing, colors, alignment, hierarchy, typography, and more. Free, instant, no login required.",
  openGraph: {
    title: "UI Analyzer — Free Design Score Tool by Nitin Monga",
    description: "Get a professional scored analysis of any UI screenshot across 7 design criteria. Free and instant.",
  },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is the UI Design Analyzer completely free?", acceptedAnswer: { "@type": "Answer", text: "Yes — 100% free with no account required. Upload your screenshot, get your score, and share it. There are no hidden tiers or paywalls." } },
    { "@type": "Question", name: "What file formats are supported?", acceptedAnswer: { "@type": "Answer", text: "JPG, PNG, and WebP files up to 10MB. For best results use a full-page or component screenshot at 1x or 2x resolution." } },
    { "@type": "Question", name: "How is the overall score calculated?", acceptedAnswer: { "@type": "Answer", text: "Seven criteria are scored independently — color, spacing, alignment, consistency, hierarchy, typography, and corner rounding — and blended using mode-specific weights. A dashboard layout puts more weight on alignment and consistency than a poster design would." } },
    { "@type": "Question", name: "What is a good UI design score?", acceptedAnswer: { "@type": "Answer", text: "90–100 is S-grade (publication ready). 80–89 is A-grade (professional quality). 70–79 is B-grade (good with minor fixes). Below 60 means there are foundational issues worth addressing before shipping." } },
    { "@type": "Question", name: "What is the difference between the four analysis modes?", acceptedAnswer: { "@type": "Answer", text: "Each mode adjusts scoring weights for what matters most in that context. Web UI weights spacing and alignment heavily. Mobile emphasises touch target spacing. Poster prioritises color and hierarchy. Dashboard focuses on alignment and information density." } },
    { "@type": "Question", name: "Can I analyze a mobile app screenshot?", acceptedAnswer: { "@type": "Answer", text: "Absolutely — select the Mobile mode before uploading. The analyzer applies weights tuned for mobile UI patterns, including tighter spacing tolerances and touch-target hierarchy." } },
    { "@type": "Question", name: "Are my uploaded images stored?", acceptedAnswer: { "@type": "Answer", text: "Images are uploaded to Cloudinary for processing and a thumbnail is saved with the analysis result so you can share it. No images are sold or used for training data." } },
    { "@type": "Question", name: "How accurate is the analysis compared to a human designer?", acceptedAnswer: { "@type": "Answer", text: "The tool is strong at objective, measurable signals — contrast ratios, alignment grids, spacing consistency. Subjective qualities like brand feel are beyond any automated tool. Think of it as a fast second opinion, not a replacement for design review." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",  item: "https://nitinmonga.in/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://nitinmonga.in/tools/" },
    { "@type": "ListItem", position: 3, name: "UI Analyzer", item: "https://nitinmonga.in/tools/ui-analyzer/" },
  ],
};

export default function UIAnalyzerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <UIAnalyzerClient />
    </>
  );
}
