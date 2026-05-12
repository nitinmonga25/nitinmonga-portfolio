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

export default function UIAnalyzerPage() {
  return <UIAnalyzerClient />;
}
