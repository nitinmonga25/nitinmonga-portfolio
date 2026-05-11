"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ServiceItem {
  title: string;
  description: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { title: "Web Design", description: "Conversion-focused designs delivered as pixel-perfect Figma mockups before development begins." },
  { title: "WordPress Dev", description: "Fast, SEO-optimized WordPress sites with custom themes. Hand-coded — no page-builder bloat." },
  { title: "Next.js Dev", description: "Modern web apps with Next.js 14, TypeScript, Prisma and Tailwind. SSR, SSG, API routes included." },
  { title: "Branding & Identity", description: "Logo design, brand guidelines, colour systems and typography that make you instantly recognizable." },
  { title: "3D & CGI Production", description: "Product visualization, CGI ads and 3D motion graphics. 40+ campaigns delivered using Blender & C4D." },
  { title: "SEO & Monetization", description: "Technical SEO audits, content strategy, AdSense & affiliate setup. My platforms hit 75K+ monthly impressions." },
];

// Icons matched by index — hardcoded since SVGs cannot be stored in JSON
const SERVICE_ICONS = [
  <svg key="0" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M9 24h10M14 20v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>,
  <svg key="1" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M14 3C14 3 9 8 9 14s5 11 5 11M14 3c0 0 5 5 5 11s-5 11-5 11M3 14h22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>,
  <svg key="2" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M6 10l-4 4 4 4M22 10l4 4-4 4M17 5l-6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  <svg key="3" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M4 20c4-8 16-8 20 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.6"/>
  </svg>,
  <svg key="4" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 3L25 9v10L14 25 3 19V9L14 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M14 3v22M3 9l11 7 11-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>,
  <svg key="5" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <polyline points="4,18 10,12 14,16 20,8 24,10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 22h20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>,
];

export function Services({ content }: { content?: { services: ServiceItem[] } }) {
  const services = content?.services ?? DEFAULT_SERVICES;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".service-card");
    if (!cards) return;

    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 32,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 95%",
          once: true,
        },
        delay: (i % 3) * 0.1,
      });
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateZ(4px)`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[var(--color-bg)]"
      aria-labelledby="services-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-14">
          <p className="section-label mb-4">{"// What I Do"}</p>
          <h2
            id="services-heading"
            className="font-display font-bold text-[var(--color-ink)]"
            style={{ fontSize: "clamp(36px, 4.5vw, 60px)" }}
          >
            Services & Expertise
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ title, description }, idx) => (
            <div
              key={title}
              className="service-card card flex flex-col gap-5 p-7 cursor-default group"
              style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease", willChange: "transform" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-[var(--color-accent)] flex-shrink-0"
                style={{ background: "var(--color-accent-light)" }}
              >
                {SERVICE_ICONS[idx] ?? SERVICE_ICONS[0]}
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-[var(--color-ink)] text-[18px] leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-200">
                {title}
              </h3>

              {/* Description */}
              <p className="font-body text-[var(--color-muted)] text-[14px] leading-relaxed flex-1">
                {description}
              </p>

            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <a href="/services/" className="btn-secondary inline-flex gap-2 items-center">
            View All Services
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
