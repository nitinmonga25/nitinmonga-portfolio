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
  year: string;
}

const DEFAULT_PROJECTS: WorkProject[] = [
  { title: "Music Platform", slug: "music-platform", category: "Web Design", tags: ["WordPress", "SEO", "AdSense"], year: "2023" },
  { title: "Audio Tools Platform", slug: "audio-tools-platform", category: "Next.js Dev", tags: ["Next.js", "MySQL", "Prisma"], year: "2024" },
  { title: "CGI Product Campaign", slug: "cgi-product-campaign", category: "3D", tags: ["Blender", "CGI", "Motion"], year: "2024" },
  { title: "Brand Identity — Tech Startup", slug: "brand-identity-tech", category: "Branding", tags: ["Figma", "Illustrator"], year: "2023" },
  { title: "Templates & Resources Site", slug: "templates-resources", category: "Web Design", tags: ["WordPress", "AdSense"], year: "2022" },
  { title: "Full-Stack Web Application", slug: "full-stack-app", category: "Next.js Dev", tags: ["Next.js", "TypeScript", "Tailwind"], year: "2024" },
  { title: "E-commerce Brand Campaign", slug: "ecommerce-campaign", category: "3D", tags: ["C4D", "CGI", "Compositing"], year: "2023" },
  { title: "Real Estate Landing Page", slug: "real-estate-landing", category: "Web Design", tags: ["WordPress", "Elementor"], year: "2022" },
  { title: "SaaS Dashboard UI", slug: "saas-dashboard", category: "Next.js Dev", tags: ["Next.js", "Tailwind", "Charts"], year: "2025" },
  { title: "Fashion Brand Identity", slug: "fashion-branding", category: "Branding", tags: ["Figma", "Photoshop", "Identity"], year: "2023" },
  { title: "Product Visualization", slug: "product-viz", category: "3D", tags: ["Blender", "Rendering", "eCommerce"], year: "2024" },
  { title: "Digital Agency Website", slug: "agency-website", category: "Web Design", tags: ["WordPress", "GSAP", "Animation"], year: "2024" },
];

const FILTERS = ["All", "Web Design", "Next.js Dev", "Branding", "3D"];

export function WorkGrid({ projects }: { projects?: WorkProject[] }) {
  const ref = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const data = projects ?? DEFAULT_PROJECTS;

  const filtered = activeFilter === "All" ? data : data.filter((p) => p.category === activeFilter);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const cards = document.querySelectorAll<HTMLElement>(".wg-card");
      gsap.from(cards, {
        opacity: 0, y: 28, stagger: 0.07, duration: 0.5, ease: "power2.out", clearProps: "all",
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [activeFilter]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2)  / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateZ(4px)`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  }, []);

  return (
    <section ref={ref} className="pb-24 bg-[var(--color-bg)]" aria-label="Projects Grid">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Filters */}
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
          <span className="font-body text-[13px] text-[var(--color-muted)] ml-2 self-center">
            {filtered.length} projects
          </span>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(({ title, slug, category, tags, year }) => (
            <div
              key={slug}
              className="wg-card group card overflow-hidden cursor-default"
              style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease", willChange: "transform" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Thumbnail */}
              <div className="h-48 relative overflow-hidden flex items-center justify-center" style={{ background: "var(--color-accent-light)" }}>
                <div className="w-14 h-14 rounded-full border-2 border-[var(--color-accent)]/30 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20" />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ background: "rgba(255,61,0,0.06)" }}>
                  <Link
                    href={`/work/${slug}/`}
                    className="font-body font-semibold text-[13px] px-5 py-2.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    style={{ background: "var(--color-surface)", color: "var(--color-ink)" }}
                  >
                    View Case Study →
                  </Link>
                </div>
                {/* Year badge */}
                <span className="absolute top-3 right-3 font-body text-[11px] font-semibold text-[var(--color-muted)] bg-[var(--color-surface)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                  {year}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" aria-hidden="true" />
                  <span className="font-body text-[11px] uppercase tracking-[2px] text-[var(--color-muted)]">{category}</span>
                </div>
                <h2 className="font-display font-bold text-[var(--color-ink)] text-[17px] leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-200">
                  {title}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="font-body text-[11px] px-2.5 py-0.5 rounded-full" style={{ background: "var(--color-accent-light)", color: "var(--color-accent-dark)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-[var(--color-border)]">
                  <Link
                    href={`/work/${slug}/`}
                    className="font-body text-[13px] text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors duration-200"
                  >
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
