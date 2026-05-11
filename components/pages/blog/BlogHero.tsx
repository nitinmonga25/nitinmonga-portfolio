"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export interface BlogHeroContent {
  title: string;
  subtitle: string;
  topics: string[];
}

const DEFAULT: BlogHeroContent = {
  title: "Thoughts &\nInsights",
  subtitle: "Practical articles on web design, 3D production, development and building digital products.",
  topics: ["Web Design", "Development", "3D & Design", "SEO", "Entrepreneurship"],
};

export function BlogHero({ content }: { content?: BlogHeroContent }) {
  const c = { ...DEFAULT, ...content };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bh-label",  { y: -12, duration: 0.5, delay: 0.1 });
      gsap.from(".bh-title",  { y: 28, duration: 0.7, delay: 0.25, ease: "power3.out" });
      gsap.from(".bh-sub",    { y: 16, duration: 0.6, delay: 0.4 });
      gsap.from(".bh-topic",  { scale: 0.88, duration: 0.4, stagger: 0.07, delay: 0.5 });
    });
    return () => ctx.revert();
  }, []);

  const titleLines = c.title.split("\n");

  return (
    <section className="pt-28 pb-12 bg-[var(--color-bg)]" aria-labelledby="blog-page-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="bh-label section-label mb-5">{"// Blog"}</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <h1
              id="blog-page-heading"
              className="bh-title font-display font-bold text-[var(--color-ink)] leading-[1.04] mb-5"
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
            <p className="bh-sub font-body text-[var(--color-muted)] text-[16px] leading-relaxed max-w-md">
              {c.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {c.topics.map((t) => (
              <span
                key={t}
                className="bh-topic font-body text-[12px] font-semibold uppercase tracking-[1.5px] px-3.5 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] bg-[var(--color-surface)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
