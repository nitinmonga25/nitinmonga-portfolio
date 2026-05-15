export const revalidate = 3600;

import type { Metadata } from "next";
import { SITE_URL, resolveOg } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { QRStudioClient } from "./QRStudioClient";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string; ogImage?: string }>("meta.tools-qr-studio");
  const title       = meta?.title       || "Brand QR Studio — Free Styled QR Code Generator";
  const description = meta?.description || "Generate beautiful branded QR codes for websites, WiFi, UPI, WhatsApp, Instagram, vCards and more. 7 style presets, custom colors, logo support, PNG & SVG export. Free, instant, no login.";
  const ogImage     = resolveOg(meta?.ogImage);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/tools/qr-studio/` },
    openGraph: {
      title,
      description,
      url:    `${SITE_URL}/tools/qr-studio/`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card:  "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const FAQ = [
  {
    q: "Is Brand QR Studio completely free?",
    a: "Yes — all QR types, styles, and export formats are free with no login required. PNG, SVG, and transparent exports are included.",
  },
  {
    q: "Which QR code types are supported?",
    a: "Website URL, WiFi credentials, WhatsApp chat links, UPI payment, Instagram profiles, Google Reviews, digital vCards (business cards), and email links.",
  },
  {
    q: "Will the styled QR codes still scan reliably?",
    a: "Yes. All exports use High (H) error correction level which allows up to 30% of the pattern to be damaged or styled while remaining scannable by any QR reader.",
  },
  {
    q: "Can I add my own logo to the QR code?",
    a: "Yes. Upload any PNG or SVG logo and it will be embedded in the center of the QR code. The error correction ensures the QR remains fully scannable.",
  },
  {
    q: "What export formats are available?",
    a: "PNG at 1000×1000 px suitable for print and digital, SVG for infinite scalability and vector editing, and transparent PNG for overlaying on any background.",
  },
  {
    q: "How is this different from a basic QR code generator?",
    a: "Most QR generators produce a plain black-and-white grid. Brand QR Studio lets you choose dot shapes, corner styles, gradient fills, logo placement, and professional presets — producing QR codes you'd actually want to put on packaging, business cards, or a storefront.",
  },
];

export default function QRStudioPage() {
  const jsonLd = {
    "@context":   "https://schema.org",
    "@type":      "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type":          "Question",
      name:             q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[var(--color-bg)] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-28 pb-24">

          {/* Header */}
          <div className="mb-10">
            <p className="section-label mb-4">// Brand QR Studio</p>
            <h1
              className="font-display font-bold text-[var(--color-ink)] leading-tight mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.02em" }}
            >
              QR Codes That Actually<br />
              <span className="text-[var(--color-accent)]">Look Like Your Brand</span>
            </h1>
            <p className="font-body text-[var(--color-muted)] text-[15px] max-w-[520px] leading-relaxed">
              Generate styled QR codes for websites, WiFi, UPI, WhatsApp, Instagram, vCards and more. Choose from 7 design presets, customize colors, add your logo, and export in PNG or SVG.
            </p>
          </div>

          {/* Tool */}
          <QRStudioClient />

          {/* FAQ */}
          <div className="mt-24">
            <p className="section-label mb-3">// FAQ</p>
            <h2 className="font-display font-bold text-[var(--color-ink)] text-[22px] mb-6">
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-3 max-w-[760px]">
              {FAQ.map(({ q, a }, i) => (
                <details
                  key={i}
                  style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "14px" }}
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-body text-[14px] font-semibold text-[var(--color-ink)]">
                    {q}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0" style={{ color: "var(--color-accent)" }}>
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </summary>
                  <p className="px-5 pb-4 font-body text-[13px] text-[var(--color-muted)] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
