import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string }>("meta.tools");
  return {
    title:       meta?.title       || "Free Design & Dev Tools",
    description: meta?.description || "Free tools for designers and developers — color palette generator, UI analyzer, and more. Built by Nitin Monga.",
  };
}

const TOOLS = [
  {
    href:        "/tools/ui-analyzer/",
    label:       "UI Design Analyzer",
    description: "Upload any UI screenshot and get a professional score across 7 criteria — color, spacing, alignment, hierarchy, typography and more. Free & instant.",
    tags:        ["Design", "Accessibility", "Dev"],
    status:      "live",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="24" height="16" rx="3" stroke="#FF3D00" strokeWidth="1.6"/>
        <path d="M8 22h12M14 20v2" stroke="#FF3D00" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M6 12l4-4 4 4 4-5" stroke="#FF3D00" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="8" r="2" fill="#FF3D00"/>
      </svg>
    ),
  },
  {
    href:        "/tools/color-palette-generator-extractor/",
    label:       "Color Palette Generator & Extractor",
    description: "Pick a base color, choose a harmony — get a full 11-shade Tailwind-style scale. Extract palettes from images. Export as CSS variables, Tailwind config, or SCSS.",
    tags:        ["Design", "CSS", "Tailwind"],
    status:      "live",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="9"  cy="9"  r="5" fill="#FF3D00" opacity="0.9"/>
        <circle cx="19" cy="9"  r="5" fill="#3B82F6" opacity="0.9"/>
        <circle cx="14" cy="18" r="5" fill="#10B981" opacity="0.9"/>
      </svg>
    ),
  },
  {
    href:        "/tools/qr-studio/",
    label:       "Brand QR Studio",
    description: "Generate beautifully styled QR codes for websites, WiFi, UPI, WhatsApp, Instagram, vCards and more. 7 design presets, custom colors, logo support, mockup previews, PNG & SVG export.",
    tags:        ["Design", "Branding", "Utility"],
    status:      "live",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="9" height="9" rx="2" stroke="#FF3D00" strokeWidth="1.6"/>
        <rect x="16" y="3" width="9" height="9" rx="2" stroke="#FF3D00" strokeWidth="1.6"/>
        <rect x="3" y="16" width="9" height="9" rx="2" stroke="#FF3D00" strokeWidth="1.6"/>
        <rect x="5" y="5" width="5" height="5" rx="1" fill="#FF3D00" opacity="0.4"/>
        <rect x="18" y="5" width="5" height="5" rx="1" fill="#FF3D00" opacity="0.4"/>
        <rect x="5" y="18" width="5" height="5" rx="1" fill="#FF3D00" opacity="0.4"/>
        <path d="M19 16h2v2h-2zM23 16h2v2h-2zM19 20h2v2h-2zM21 22h4v3h-4zM23 18h2v4" stroke="#FF3D00" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href:        "#",
    label:       "CSS Gradient Generator",
    description: "Build linear, radial and conic gradients visually. Copy CSS or Tailwind output instantly.",
    tags:        ["Design", "CSS"],
    status:      "soon",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#g1)"/>
        <defs>
          <linearGradient id="g1" x1="2" y1="2" x2="26" y2="26">
            <stop offset="0%" stopColor="#FF3D00"/>
            <stop offset="100%" stopColor="#3B82F6"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    href:        "#",
    label:       "Box Shadow Generator",
    description: "Layer multiple box shadows visually with live preview. Copy CSS output.",
    tags:        ["Design", "CSS"],
    status:      "soon",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="6" y="6" width="18" height="18" rx="4" fill="rgba(255,61,0,0.15)" stroke="var(--color-border)" strokeWidth="1.5"/>
        <rect x="4" y="4" width="18" height="18" rx="4" fill="white" stroke="#FF3D00" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    href:        "#",
    label:       "JSON Formatter",
    description: "Paste raw JSON — beautify, minify, validate and copy in one click.",
    tags:        ["Dev", "Utility"],
    status:      "soon",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M8 6C6 6 5 7 5 9v2c0 2-1 3-1 3s1 1 1 3v2c0 2 1 3 3 3" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M20 6c2 0 3 1 3 3v2c0 2 1 3 1 3s-1 1-1 3v2c0 2-1 3-3 3" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="2" fill="#3B82F6"/>
      </svg>
    ),
  },
  {
    href:        "#",
    label:       "Meta Tag Generator",
    description: "Enter title, description and image — preview how it looks on Google, Twitter and LinkedIn, then copy the HTML.",
    tags:        ["SEO", "Dev"],
    status:      "soon",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="24" height="16" rx="3" stroke="#10B981" strokeWidth="1.6"/>
        <path d="M6 11h16M6 15h10" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href:        "#",
    label:       "px → rem Converter",
    description: "Convert between px, rem and em instantly. Set your base font size.",
    tags:        ["Dev", "CSS"],
    status:      "soon",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <text x="2" y="18" fontFamily="monospace" fontSize="11" fill="#8B5CF6" fontWeight="bold">px</text>
        <path d="M18 14l-4-4 4-4M18 14l4-4-4-4" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(2,4)"/>
      </svg>
    ),
  },
  {
    href:        "#",
    label:       "Color Contrast Checker",
    description: "Check foreground/background contrast ratios against WCAG AA and AAA standards.",
    tags:        ["Design", "Accessibility"],
    status:      "soon",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="11" stroke="var(--color-border)" strokeWidth="1.5"/>
        <path d="M14 3a11 11 0 010 22" fill="#111"/>
        <path d="M14 3a11 11 0 000 22" fill="white" stroke="var(--color-border)" strokeWidth="0.5"/>
      </svg>
    ),
  },
  {
    href:        "#",
    label:       "Regex Tester",
    description: "Test regex patterns against sample text with live match highlighting and common pattern library.",
    tags:        ["Dev", "Utility"],
    status:      "soon",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <text x="3" y="19" fontFamily="monospace" fontSize="13" fill="#F59E0B" fontWeight="bold">/.*/ </text>
      </svg>
    ),
  },
];

const TAG_COLORS: Record<string, string> = {
  Design:        "#FF3D00",
  CSS:           "#3B82F6",
  Tailwind:      "#06B6D4",
  Dev:           "#10B981",
  Utility:       "#6366F1",
  SEO:           "#F59E0B",
  Accessibility: "#8B5CF6",
  Branding:      "#EC4899",
};

export default function ToolsPage() {
  const live = TOOLS.filter((t) => t.status === "live");

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-28 pb-24">

        {/* Header */}
        <div className="mb-14">
          <p className="section-label mb-4">// Free Tools</p>
          <h1
            className="font-display font-bold text-[var(--color-ink)] leading-tight mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.02em" }}
          >
            Tools for<br />
            <span className="text-[var(--color-accent)]">Designers & Devs</span>
          </h1>
          <p className="font-body text-[var(--color-muted)] text-[16px] max-w-[520px] leading-relaxed">
            Free, no-login utilities built for the work I do every day. No ads, no limits.
          </p>
        </div>

        {/* Live tools */}
        {live.length > 0 && (
          <div className="mb-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {live.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col gap-5 p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
                  style={{
                    background: "var(--color-surface)",
                    border:     "1px solid var(--color-border)",
                    boxShadow:  "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
                    >
                      {tool.icon}
                    </div>
                    <span
                      className="font-body text-[10px] font-bold uppercase tracking-[2px] px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}
                    >
                      Live
                    </span>
                  </div>

                  <div className="flex-1">
                    <h2 className="font-display text-[17px] font-bold text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                      {tool.label}
                    </h2>
                    <p className="font-body text-[13px] text-[var(--color-muted)] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-body text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: `${TAG_COLORS[tag] ?? "#555"}18`, color: TAG_COLORS[tag] ?? "#555" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <svg
                      className="flex-shrink-0 group-hover:translate-x-1 transition-transform text-[var(--color-accent)]"
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Why these tools */}
        <div className="mb-14 grid sm:grid-cols-3 gap-5">
          {[
            { icon: "⚡", title: "Instant, no login", desc: "Every tool runs in your browser — no account, no waiting, no email required. Open a tool and start working." },
            { icon: "🎯", title: "Built for real work", desc: "These aren't demos. Each tool solves a specific problem I run into while designing and building products every day." },
            { icon: "🔓", title: "Free forever", desc: "No freemium tiers, no export limits, no watermarks. The output is yours to use in any personal or commercial project." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-5 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-2xl mb-3">{icon}</p>
              <h3 className="font-display text-[15px] font-bold text-[var(--color-ink)] mb-2">{title}</h3>
              <p className="font-body text-[13px] text-[var(--color-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <p className="section-label mb-3">// FAQ</p>
          <h2 className="font-display font-bold text-[var(--color-ink)] text-[22px] mb-6">Frequently asked questions</h2>
          <div className="flex flex-col gap-3 max-w-[760px]">
            {[
              { q: "Are all tools completely free?", a: "Yes. Every tool on this page is free with no account required, no export limits, and no watermarks. The output is yours to use in personal and commercial projects." },
              { q: "Do I need to sign up or create an account?", a: "No account needed. Open any tool and start using it immediately. Some tools save a shareable result link — that's the only data stored." },
              { q: "Can I use the tool outputs in client work?", a: "Absolutely. Color palettes, analysis reports, and any generated assets are free to use in commercial and client projects without attribution." },
              { q: "How often are new tools added?", a: "New tools are added whenever a recurring problem in my own workflow doesn't have a good free solution. Check back or follow on social media for announcements." },
              { q: "Can I suggest a tool?", a: "Yes — reach out through the contact form on the main site. If it's a problem I encounter too, it'll likely get built." },
            ].map(({ q, a }, i) => (
              <details key={i} className="group" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "14px" }}>
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-body text-[14px] font-semibold text-[var(--color-ink)]">
                  {q}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0" style={{ color: "var(--color-accent)" }}>
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
  );
}
