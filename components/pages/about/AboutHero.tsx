"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export interface AboutHeroContent {
  title: string;
  chips: string[];
  stats: Array<{ label: string; value: string }>;
}

const DEFAULT: AboutHeroContent = {
  title: "Designer.\nDeveloper.\nCreator.",
  chips: ["Graphic Design", "3D / CGI", "Full-Stack Dev", "SEO", "Branding", "WordPress"],
  stats: [
    { label: "Years Experience", value: "10+" },
    { label: "Websites Built", value: "400+" },
    { label: "CGI Campaigns", value: "40+" },
    { label: "Social Following", value: "84K+" },
    { label: "Based In", value: "Punjab, India" },
    { label: "Languages", value: "Hindi · English · Punjabi" },
  ],
};

export function AboutHero({ content }: { content?: AboutHeroContent }) {
  const c = { ...DEFAULT, ...content };
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ah-label",   { y: -12, duration: 0.5, delay: 0.1 });
      gsap.from(".ah-title",   { y: 32, duration: 0.7, delay: 0.25, ease: "power3.out" });
      gsap.from(".ah-sub",     { y: 20, duration: 0.6, delay: 0.45 });
      gsap.from(".ah-chips",   { y: 16, duration: 0.5, delay: 0.6 });
      gsap.from(".ah-card",    { x: 40, duration: 0.8, delay: 0.4, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  const titleLines = c.title.split("\n");

  return (
    <section
      ref={ref}
      className="pt-28 pb-16 bg-[var(--color-bg)]"
      aria-labelledby="about-hero-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">

          {/* Left */}
          <div className="flex-1">
            <p className="ah-label section-label mb-5">{"// About Me"}</p>
            <h1
              id="about-hero-heading"
              className="ah-title font-display font-bold text-[var(--color-ink)] mb-6 leading-[1.05]"
              style={{ fontSize: "clamp(40px, 6vw, 84px)", letterSpacing: "-0.03em" }}
            >
              {titleLines.map((line, i) => (
                <span key={i}>
                  {i === 1 ? <span className="text-[var(--color-accent)]">{line}</span> : line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="ah-sub font-body text-[var(--color-muted)] text-[16px] leading-relaxed max-w-lg mb-8">
              10+ years turning ideas into digital realities — websites, brands, 3D campaigns and platforms that reach real audiences.
            </p>
            <div className="ah-chips flex flex-wrap gap-2 mb-8">
              {c.chips.map((chip) => (
                <span
                  key={chip}
                  className="font-body text-[12px] font-semibold uppercase tracking-[1.5px] px-3.5 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] bg-[var(--color-surface)]"
                >
                  {chip}
                </span>
              ))}
            </div>
            <Link href="/contact-us/" className="btn-primary">
              Work With Me
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Right: white card with stats */}
          <div className="ah-card card p-8 flex-shrink-0 w-full lg:w-[340px]">
            <p className="section-label mb-6">At a Glance</p>
            {c.stats.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-[var(--color-border)] last:border-0">
                <span className="font-body text-[13px] text-[var(--color-muted)]">{label}</span>
                <span className="font-body text-[13px] font-semibold text-[var(--color-ink)]">{value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
