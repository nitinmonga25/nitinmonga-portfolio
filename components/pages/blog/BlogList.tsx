"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const POSTS = [
  {
    slug: "growing-a-niche-platform-to-40k-users",
    category: "Entrepreneurship",
    title: "How I Grew a Niche Platform to 40K Monthly Users",
    excerpt: "The full story — from a blank CMS install to 40,000 monthly active users. The content strategy, SEO plays, and monetization structure that made it work.",
    date: "15 Jan 2025",
    readTime: "8 min",
  },
  {
    slug: "nextjs-14-setup-every-project",
    category: "Development",
    title: "Next.js 14 App Router: The Setup I Use for Every Project",
    excerpt: "My battle-tested starter with TypeScript, Tailwind, Prisma 5, NextAuth and GSAP — the exact config and folder structure I ship with.",
    date: "10 Mar 2025",
    readTime: "6 min",
  },
  {
    slug: "cgi-advertising-india-2025",
    category: "3D & Design",
    title: "CGI Advertising in India: What Actually Converts in 2025",
    excerpt: "After 40+ 3D ad campaigns for Indian brands, here's what separates the ones that performed from the ones that didn't.",
    date: "22 Apr 2025",
    readTime: "7 min",
  },
  {
    slug: "wordpress-performance-2025",
    category: "Development",
    title: "WordPress Performance in 2025: A No-Nonsense Checklist",
    excerpt: "Most WordPress sites score 40–60 on PageSpeed. Here's the exact process I use to push sites to 90+ without switching stacks.",
    date: "5 Feb 2025",
    readTime: "5 min",
  },
  {
    slug: "logo-design-process-2025",
    category: "Web Design",
    title: "My Logo Design Process — From Brief to Final File",
    excerpt: "A transparent look at how I approach logo projects: the research phase, concept generation, client feedback, and final delivery.",
    date: "18 Mar 2025",
    readTime: "6 min",
  },
  {
    slug: "adsense-approval-guide",
    category: "SEO",
    title: "Getting Google AdSense Approved in 2025: What Still Works",
    excerpt: "AdSense has gotten stricter — but it's still absolutely achievable. Here's what my approved sites had in common.",
    date: "2 Jan 2025",
    readTime: "5 min",
  },
];

const CATEGORIES = ["All", "Development", "3D & Design", "Web Design", "SEO", "Entrepreneurship"];

export function BlogList() {
  const ref = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? POSTS : POSTS.filter((p) => p.category === activeCategory);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const cards = document.querySelectorAll<HTMLElement>(".bl-card");
      gsap.from(cards, {
        opacity: 0, y: 24, stagger: 0.08, duration: 0.5, ease: "power2.out", clearProps: "all",
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [activeCategory]);

  return (
    <section ref={ref} className="pb-24 bg-[var(--color-bg)]" aria-label="Blog posts">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10" role="tablist">
          {CATEGORIES.map((c) => (
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

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(({ slug, category, title, excerpt, date, readTime }) => (
            <Link
              key={slug}
              href={`/blog/${slug}/`}
              className="bl-card group card overflow-hidden flex flex-col hover:border-[var(--color-accent)] transition-colors duration-300"
            >
              {/* Thumbnail placeholder */}
              <div className="h-44 relative overflow-hidden flex items-center justify-center" style={{ background: "var(--color-accent-light)" }}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="opacity-25" aria-hidden="true">
                  <rect x="6" y="10" width="32" height="24" rx="2" stroke="var(--color-accent-dark)" strokeWidth="2"/>
                  <path d="M6 16h32M14 10v6M30 10v6" stroke="var(--color-accent-dark)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
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
