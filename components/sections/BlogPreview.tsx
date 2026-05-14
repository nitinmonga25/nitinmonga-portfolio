"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface BlogPostPreview {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  thumbnail?: string;
}

const DEFAULT_POSTS: BlogPostPreview[] = [
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
];

export function BlogPreview({ posts }: { posts?: BlogPostPreview[] }) {
  const data = posts ?? DEFAULT_POSTS;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".blog-card");
    cards?.forEach((card, i) => {
      gsap.from(card, {
        y: 28, duration: 0.6, ease: "power2.out", delay: i * 0.1,
        scrollTrigger: { trigger: card, start: "top 95%", once: true },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[var(--color-bg)]" aria-labelledby="blog-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label mb-4">{"// From the Blog"}</p>
            <h2 id="blog-heading" className="font-display font-bold text-[var(--color-ink)]"
              style={{ fontSize: "clamp(36px, 4.5vw, 60px)" }}>
              Thoughts &amp; Insights
            </h2>
          </div>
          <Link href="/blog/" className="btn-secondary whitespace-nowrap self-start sm:self-end">
            All Articles
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.map(({ slug, category, title, excerpt, date, readTime, thumbnail }) => (
            <Link
              key={slug}
              href={`/blog/${slug}/`}
              className="blog-card group flex flex-col bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-[8px] overflow-hidden hover:border-[var(--color-accent)] transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="h-44 bg-[var(--color-accent-light)] relative overflow-hidden flex items-center justify-center">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="opacity-25" aria-hidden="true">
                    <rect x="6" y="10" width="32" height="24" rx="2" stroke="var(--color-accent-dark)" strokeWidth="2"/>
                    <path d="M6 16h32M14 10v6M30 10v6" stroke="var(--color-accent-dark)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
                <span className="absolute top-3 left-3 font-body text-[11px] font-600 uppercase tracking-[2px] bg-[var(--color-accent)] text-white px-2.5 py-1 rounded-full">
                  {category}
                </span>
              </div>
              {/* Body */}
              <div className="flex flex-col flex-1 gap-3 p-5">
                <h3 className="font-display font-bold text-[var(--color-ink)] text-[17px] leading-snug group-hover:text-[var(--color-accent)] transition-colors duration-200">
                  {title}
                </h3>
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
