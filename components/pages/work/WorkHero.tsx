"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export interface WorkHeroContent {
  title: string;
  subtitle: string;
  stats: Array<{ num: string; label: string }>;
}

const DEFAULT: WorkHeroContent = {
  title: "Projects &\nCase Studies",
  subtitle: "A curated selection from 400+ projects across web design, development, branding and 3D production.",
  stats: [
    { num: "400+", label: "Total Projects" },
    { num: "40+", label: "CGI Campaigns" },
    { num: "10+", label: "Years Active" },
  ],
};

export function WorkHero({ content }: { content?: WorkHeroContent }) {
  const c = { ...DEFAULT, ...content };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".wh-label", { y: -12, duration: 0.5, delay: 0.1 });
      gsap.from(".wh-title", { y: 28, duration: 0.7, delay: 0.25, ease: "power3.out" });
      gsap.from(".wh-sub",   { y: 16, duration: 0.6, delay: 0.4 });
      gsap.from(".wh-stat",  { y: 12, duration: 0.5, stagger: 0.08, delay: 0.5 });
    });
    return () => ctx.revert();
  }, []);

  const titleLines = c.title.split("\n");

  return (
    <section className="pt-28 pb-12 bg-[var(--color-bg)]" aria-labelledby="work-page-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="wh-label section-label mb-5">{"// Selected Work"}</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <h1
              id="work-page-heading"
              className="wh-title font-display font-bold text-[var(--color-ink)] leading-[1.04]"
              style={{ fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.03em" }}
            >
              {titleLines[0]}
              {titleLines[1] && (
                <>
                  <br />
                  <span className="text-[var(--color-accent)]">{titleLines[1]}</span>
                </>
              )}
            </h1>
          </div>
          <div className="wh-sub font-body text-[var(--color-muted)] text-[15px] max-w-md leading-relaxed">
            {c.subtitle}
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-[var(--color-border)]">
          {c.stats.map(({ num, label }) => (
            <div key={label} className="wh-stat flex flex-col">
              <span className="font-display font-bold text-[var(--color-accent)] leading-none" style={{ fontSize: "clamp(24px, 2.5vw, 36px)" }}>{num}</span>
              <span className="font-body text-[10.5px] uppercase tracking-[2px] text-[var(--color-muted)] mt-1">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
