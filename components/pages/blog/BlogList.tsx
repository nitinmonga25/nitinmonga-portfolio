"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface BlogPostItem {
  slug:      string;
  category:  string;
  title:     string;
  excerpt:   string;
  date:      string;
  readTime:  string;
  thumbnail: string | null;
}

export function BlogList({ posts }: { posts: BlogPostItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const cards = document.querySelectorAll<HTMLElement>(".bl-card");
      gsap.from(cards, { y: 24, stagger: 0.08, duration: 0.5, ease: "power2.out", clearProps: "all" });
    });
    return () => cancelAnimationFrame(raf);
  }, [activeCategory]);

  return (
    <section ref={ref} className="pb-24 bg-[var(--color-bg)]" aria-label="Blog posts">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10" role="tablist">
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={activeCategory === c}
              onClick={() => setActiveCategory(c)}
              className={`font-body text-[13px] font-medium px-4 py-1.5 rounded-full border transition-all duration-200 ${
                activeCategory === c
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="font-display text-xl font-bold text-[var(--color-ink)]">No posts yet</p>
            <p className="font-body text-[var(--color-muted)] text-sm">Published posts will appear here.</p>
          </div>
        )}

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(({ slug, category, title, excerpt, date, readTime, thumbnail }) => (
            <Link
              key={slug}
              href={`/blog/${slug}/`}
              className="bl-card group card overflow-hidden flex flex-col hover:border-[var(--color-accent)] transition-colors duration-300"
            >
              {/* Thumbnail */}
              <div className="h-44 relative overflow-hidden flex items-center justify-center" style={{ background: "var(--color-accent-light)" }}>
                {thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="opacity-25" aria-hidden="true">
                    <rect x="6" y="10" width="32" height="24" rx="2" stroke="var(--color-accent-dark)" strokeWidth="2"/>
                    <path d="M6 16h32M14 10v6M30 10v6" stroke="var(--color-accent-dark)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
                <span className="absolute top-3 left-3 font-body text-[11px] font-semibold uppercase tracking-[2px] text-white px-2.5 py-1 rounded-full" style={{ background: "var(--color-accent)" }}>
                  {category}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 gap-3 p-5">
                <h2 className="font-display font-bold text-[var(--color-ink)] text-[17px] leading-snug group-hover:text-[var(--color-accent)] transition-colors duration-200">
                  {title}
                </h2>
                <p className="font-body text-[var(--color-muted)] text-[14px] leading-relaxed flex-1 line-clamp-3">
                  {excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                  <span className="font-body text-[12px] text-[var(--color-muted)]">{date}</span>
                  <span className="font-body text-[12px] text-[var(--color-muted)]">{readTime} read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
