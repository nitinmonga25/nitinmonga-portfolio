"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface WorkProject {
  title: string;
  slug: string;
  category: string;
  tags: string[];
}

const DEFAULT_PROJECTS: WorkProject[] = [
  { title: "Music Platform", slug: "music-platform", category: "Web Design", tags: ["WordPress", "SEO", "AdSense"] },
  { title: "Audio Tools Platform", slug: "audio-tools-platform", category: "Next.js Dev", tags: ["Next.js", "MySQL", "Prisma"] },
  { title: "CGI Product Campaign", slug: "cgi-product-campaign", category: "3D", tags: ["Blender", "CGI", "Motion"] },
  { title: "Brand Identity — Tech Startup", slug: "brand-identity-tech-startup", category: "Branding", tags: ["Figma", "Illustrator"] },
  { title: "Templates & Resources Site", slug: "templates-resources-site", category: "Web Design", tags: ["WordPress", "AdSense"] },
  { title: "Full-Stack Web Application", slug: "full-stack-web-app", category: "Next.js Dev", tags: ["Next.js", "TypeScript", "Tailwind"] },
];

const FILTERS = ["All", "Web Design", "Next.js Dev", "Branding", "3D"];

export function Work({ projects }: { projects?: WorkProject[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const data = projects ?? DEFAULT_PROJECTS;

  const filtered =
    activeFilter === "All"
      ? data
      : data.filter((p) => p.category === activeFilter);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".work-header", {
      y: 24, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: ".work-header", start: "top 95%", once: true },
    });
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const cards = document.querySelectorAll<HTMLElement>(".project-card");
      gsap.from(cards, {
        opacity: 0, y: 32, stagger: 0.08, duration: 0.55, ease: "power2.out", clearProps: "all",
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [activeFilter]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2)  / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateZ(6px)`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[var(--color-bg)]" aria-labelledby="work-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="work-header flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-label mb-4">{"// Selected Work"}</p>
            <h2 id="work-heading" className="font-display font-bold text-[var(--color-ink)]"
              style={{ fontSize: "clamp(36px, 4.5vw, 60px)" }}>
              Projects &amp; Case Studies
            </h2>
          </div>
          <Link href="/work/" className="btn-secondary whitespace-nowrap self-start sm:self-end">
            View All Work
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={activeFilter === f}
              onClick={() => setActiveFilter(f)}
              className={`font-body text-[13px] font-medium px-4 py-1.5 rounded-full border transition-all duration-200 ${
                activeFilter === f
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(({ title, slug, category, tags }) => (
            <div
              key={slug}
              className="project-card group relative bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-[8px] overflow-hidden"
              style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease", willChange: "transform" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Thumbnail placeholder */}
              <div className="h-48 bg-[var(--color-accent-light)] relative overflow-hidden flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-[var(--color-accent)]/30 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20" />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[var(--color-accent)]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={`/work/${slug}/`}
                    className="bg-white text-[var(--color-ink)] font-body font-medium text-[13px] px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  >
                    View Case Study →
                  </Link>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" aria-hidden="true"/>
                  <span className="font-body text-[11px] uppercase tracking-[2px] text-[var(--color-muted)]">{category}</span>
                </div>
                <h3 className="font-display font-bold text-[var(--color-ink)] text-[17px] leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-200">
                  {title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="font-body text-[11px] px-2.5 py-0.5 bg-[var(--color-accent-light)] text-[var(--color-accent-dark)] rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center pt-1 border-t border-[var(--color-border)]">
                  <Link href={`/work/${slug}/`} className="font-body text-[13px] text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors duration-200">
                    Case Study →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
