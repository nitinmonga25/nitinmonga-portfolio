import Link from "next/link";

const PLATFORMS = [
  {
    name:    "Adobe Exchange",
    role:    "Official Publisher",
    desc:    "Publishing plugins, extensions & creative assets on Adobe's official marketplace.",
    href:    "https://exchange.adobe.com/publisher/cc/fcdc1bb3-e75a-4790-87d6-77d9e4e83c56/nitin-monga?page=1",
    color:   "#FF0000",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#FF0000"/>
        <path d="M7 24L13.5 8h1.2L11 18.5h4.8L19.5 8h1.2L14 24h-1.2l2-4.5H10L8.2 24H7z" fill="white"/>
        <path d="M18.5 24l3.5-8.5h1.1L19.6 24H18.5z" fill="white"/>
        <path d="M21 13.5c0-.83.67-1.5 1.5-1.5S24 12.67 24 13.5 23.33 15 22.5 15 21 14.33 21 13.5z" fill="white"/>
      </svg>
    ),
  },
  {
    name:    "Freepik / Magnific",
    role:    "Verified Contributor",
    desc:    "Distributing premium graphic resources, templates & design assets to millions of creators worldwide.",
    href:    "https://www.magnific.com/author/nitinmonga18",
    color:   "#1273EB",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#1273EB"/>
        <path d="M8 22V10h9a5 5 0 010 10h-5v2H8zm4-5h5a2 2 0 000-4h-5v4z" fill="white"/>
      </svg>
    ),
  },
  {
    name:    "WordPress.org",
    role:    "Plugin Developer",
    desc:    "Publishing open-source WordPress plugins & themes used by developers and site owners globally.",
    href:    "https://profiles.wordpress.org/nitinmonga14/",
    color:   "#21759B",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#21759B"/>
        <circle cx="16" cy="16" r="9" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M7 16c0 2.4.9 4.6 2.3 6.3L7.4 16H7zm15.7 0l-3.5 10.1A9 9 0 0025 16h-2.3zM16 7a9 9 0 00-7 3.4l4.7 12.8A9 9 0 0016 7z" fill="white"/>
      </svg>
    ),
  },
];

export function Distributions() {
  return (
    <section className="py-16" style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="section-label mb-2">// Distributed On</p>
            <h2 className="font-display font-bold text-[var(--color-ink)] text-[22px] leading-tight">
              Official publisher on global platforms
            </h2>
          </div>
          <p className="font-body text-[13px] text-[var(--color-muted)] max-w-[300px]">
            My work reaches designers &amp; developers worldwide through these platforms.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {PLATFORMS.map(({ name, role, desc, href, color, icon }) => (
            <Link
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-1"
              style={{
                background:  "var(--color-bg)",
                border:      "1px solid var(--color-border)",
                boxShadow:   "var(--shadow-card)",
              }}
            >
              {/* Icon + badge */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  {icon}
                </div>
                <span
                  className="font-body text-[10px] font-bold uppercase tracking-[2px] px-2.5 py-1 rounded-full"
                  style={{ background: `${color}15`, color }}
                >
                  {role}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="font-display text-[16px] font-bold text-[var(--color-ink)] mb-1.5 group-hover:text-[var(--color-accent)] transition-colors">
                  {name}
                </h3>
                <p className="font-body text-[13px] text-[var(--color-muted)] leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1.5 mt-auto font-body text-[12px] font-semibold transition-colors group-hover:text-[var(--color-accent)]" style={{ color: "var(--color-muted)" }}>
                View Profile
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
