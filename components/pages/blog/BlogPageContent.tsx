"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export interface BlogPostItem {
  slug:      string;
  category:  string;
  title:     string;
  excerpt:   string;
  date:      string;
  readTime:  string;
  thumbnail: string | null;
}

export function BlogPageContent({ posts, heroTitle, heroSubtitle }: {
  posts:        BlogPostItem[];
  heroTitle:    string;
  heroSubtitle: string;
}) {
  const [active, setActive] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered   = active === "All" ? posts : posts.filter((p) => p.category === active);

  useEffect(() => {
    gsap.from(".blg-head", { y: 32, duration: 0.85, ease: "power3.out", stagger: 0.1 });
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>(".blog-card");
      if (cards?.length) {
        gsap.from(cards, { y: 28, duration: 0.5, stagger: 0.06, ease: "power2.out", clearProps: "all" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [active]);

  const titleLines = heroTitle.split("\n");

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-28 pb-12">

        {/* Top row: label + count */}
        <div className="blg-head flex items-center justify-between mb-6">
          <p className="section-label">// Writing</p>
          <div className="flex items-center gap-2">
            <span
              className="font-display font-bold leading-none"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)", color: "var(--color-accent)", letterSpacing: "-0.04em" }}
            >
              {String(posts.length).padStart(2, "0")}
            </span>
            <span className="font-body text-[12px] text-[var(--color-muted)]">articles</span>
          </div>
        </div>

        {/* Title */}
        <h1
          className="blg-head font-display font-bold text-[var(--color-ink)] leading-[1.04]"
          style={{ fontSize: "clamp(44px, 7vw, 96px)", letterSpacing: "-0.03em" }}
        >
          {titleLines[0]}
          {titleLines[1] && (
            <><br /><span style={{ color: "var(--color-accent)" }}>{titleLines[1]}</span></>
          )}
        </h1>

        {/* Subtitle */}
        {heroSubtitle && (
          <p className="blg-head font-body text-[var(--color-muted)] mt-4 max-w-[480px]" style={{ fontSize: "clamp(14px, 1.1vw, 16px)", lineHeight: 1.7 }}>
            {heroSubtitle}
          </p>
        )}
      </div>

      {/* ── FILTER STRIP ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 py-3.5 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="flex-shrink-0 font-body text-[13px] font-medium px-4 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  background:  active === cat ? "var(--color-accent)" : "transparent",
                  color:       active === cat ? "#fff" : "var(--color-muted)",
                  borderColor: active === cat ? "var(--color-accent)" : "var(--color-border)",
                }}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto flex-shrink-0 font-body text-[12px] text-[var(--color-muted)]">
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── POSTS ────────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 pb-28" ref={gridRef}>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <p className="font-display font-bold" style={{ fontSize: "80px", color: "var(--color-border)", lineHeight: 1 }}>ø</p>
            <p className="font-display text-xl font-bold text-[var(--color-ink)]">No articles yet</p>
            <p className="font-body text-sm text-[var(--color-muted)]">Published posts will appear here.</p>
          </div>
        )}

        {/* All posts — 3-col grid */}
        {filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Post card ───────────────────────────────────────────────────────────── */
function PostCard({ post, index }: { post: BlogPostItem; index: number }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/blog/${post.slug}/`}
      className="blog-card group flex flex-col overflow-hidden rounded-[20px] bg-[var(--color-surface)] border border-[var(--color-border)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[0_12px_40px_rgba(255,61,0,0.1)]"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: "210px" }}>
        {post.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--color-accent-light)" }}>
            <span
              className="font-display font-bold"
              style={{ fontSize: "40px", color: "transparent", WebkitTextStroke: "1px var(--color-accent)", opacity: 0.5 }}
            >
              {num}
            </span>
          </div>
        )}
        {/* Issue number badge */}
        <div
          className="absolute top-4 right-4 font-display text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
        >
          {num}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-3 p-5 lg:p-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-accent)" }} />
          <span className="font-body text-[11px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--color-accent)" }}>
            {post.category}
          </span>
        </div>

        <h2
          className="font-display font-bold text-[var(--color-ink)] leading-[1.2] group-hover:text-[var(--color-accent)] transition-colors duration-200 flex-1"
          style={{ fontSize: "17px" }}
        >
          {post.title}
        </h2>

        <p className="font-body text-[var(--color-muted)] text-[14px] leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        <div
          className="flex items-center justify-between pt-4 mt-auto"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <span className="font-body text-[12px] text-[var(--color-muted)]">{post.date}</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[3px] items-center">
              {Array.from({ length: 5 }).map((_, i) => {
                const mins   = parseInt(post.readTime) || 5;
                const filled = i < Math.ceil(mins / 2);
                return (
                  <div
                    key={i}
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: filled ? "var(--color-accent)" : "var(--color-border)" }}
                  />
                );
              })}
            </div>
            <span className="font-body text-[12px] text-[var(--color-muted)]">{post.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
