import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Design & Dev Tools",
  description: "Free tools for designers and developers — color palette generator, CSS utilities, and more. Built by Nitin Monga.",
};

const TOOLS = [
  {
    href:        "/tools/color-palette/",
    label:       "Color Palette Generator",
    description: "Pick a base color, choose a harmony — get a full 11-shade Tailwind-style scale. Export as CSS variables, Tailwind config, or SCSS.",
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
};

export default function ToolsPage() {
  const live  = TOOLS.filter((t) => t.status === "live");
  const soon  = TOOLS.filter((t) => t.status === "soon");

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
            <p className="font-body text-[11px] font-bold uppercase tracking-[3px] text-[var(--color-accent)] mb-5">Available Now</p>
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

        {/* Coming soon */}
        <div>
          <p className="font-body text-[11px] font-bold uppercase tracking-[3px] text-[var(--color-muted)] mb-5">Coming Soon</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {soon.map((tool) => (
              <div
                key={tool.label}
                className="flex flex-col gap-4 p-6 rounded-2xl opacity-60"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
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
                    style={{ background: "rgba(107,101,96,0.1)", color: "var(--color-muted)" }}
                  >
                    Soon
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-[15px] font-bold text-[var(--color-ink)] mb-1.5">{tool.label}</h2>
                  <p className="font-body text-[12px] text-[var(--color-muted)] leading-relaxed">{tool.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: `${TAG_COLORS[tag] ?? "#555"}12`, color: TAG_COLORS[tag] ?? "#555" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
