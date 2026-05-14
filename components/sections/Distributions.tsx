import Link from "next/link";
import Image from "next/image";

const PLATFORMS = [
  {
    name:  "Adobe Exchange",
    role:  "Official Publisher",
    desc:  "Publishing plugins, extensions & creative assets on Adobe's official marketplace.",
    href:  "https://exchange.adobe.com/publisher/cc/fcdc1bb3-e75a-4790-87d6-77d9e4e83c56/nitin-monga?page=1",
    color: "#FF0000",
    logo:  "/logos/adobe.png",
  },
  {
    name:  "Freepik / Magnific",
    role:  "Verified Contributor",
    desc:  "Distributing premium graphic resources, templates & design assets to millions of creators worldwide.",
    href:  "https://www.magnific.com/author/nitinmonga18",
    color: "#1273EB",
    logo:  "/logos/magnific.png",
  },
  {
    name:  "WordPress.org",
    role:  "Plugin Developer",
    desc:  "Publishing open-source WordPress plugins & themes used by developers and site owners globally.",
    href:  "https://profiles.wordpress.org/nitinmonga14/",
    color: "#21759B",
    logo:  "/logos/wordpress.png",
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
          {PLATFORMS.map(({ name, role, desc, href, color, logo }) => (
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
              {/* Logo + badge */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                  <Image src={logo} alt={name} width={40} height={40} className="object-contain" />
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
