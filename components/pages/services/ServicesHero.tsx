"use client";

import { useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export interface ServicesHeroContent {
  title: string;
  subtitle: string;
  pills: string[];
}

const DEFAULT: ServicesHeroContent = {
  title: "Everything you need\nto ship online.",
  subtitle: "From a single landing page to a full brand system with 3D assets — I handle design, development and SEO as a single engagement.",
  pills: ["Web Design", "WordPress Dev", "Next.js Dev", "Branding", "3D & CGI", "SEO & Monetization"],
};

export function ServicesHero({ content }: { content?: ServicesHeroContent }) {
  const c = { ...DEFAULT, ...content };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".sh-label",  { y: -12, duration: 0.5, delay: 0.1 });
      gsap.from(".sh-title",  { y: 28, duration: 0.7, delay: 0.25, ease: "power3.out" });
      gsap.from(".sh-sub",    { y: 16, duration: 0.6, delay: 0.4 });
      gsap.from(".sh-cta",    { y: 12, duration: 0.5, delay: 0.55 });
      gsap.from(".sh-pill",   { scale: 0.88, duration: 0.45, stagger: 0.08, delay: 0.5 });
    });
    return () => ctx.revert();
  }, []);

  const titleLines = c.title.split("\n");

  return (
    <section className="pt-28 pb-16 bg-[var(--color-bg)]" aria-labelledby="services-page-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="max-w-[640px]">
            <p className="sh-label section-label mb-5">{"// Services"}</p>
            <h1
              id="services-page-heading"
              className="sh-title font-display font-bold text-[var(--color-ink)] mb-5 leading-[1.04]"
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
            <p className="sh-sub font-body text-[var(--color-muted)] text-[16px] leading-relaxed mb-8 max-w-lg">
              {c.subtitle}
            </p>
            <div className="sh-cta flex flex-wrap gap-3">
              <Link href="/contact-us/" className="btn-primary">
                Get a Quote
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/work/" className="btn-secondary">View My Work</Link>
            </div>
          </div>

          {/* Floating service pills */}
          <div className="flex flex-wrap gap-2.5 lg:flex-col lg:items-end">
            {c.pills.map((s) => (
              <span
                key={s}
                className="sh-pill font-body text-[12px] font-semibold uppercase tracking-[1.5px] px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
