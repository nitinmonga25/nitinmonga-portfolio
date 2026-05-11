"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ServiceCard {
  id: string;
  title: string;
  price: string;
  description: string;
  includes: string[];
}

const DEFAULT_SERVICES: ServiceCard[] = [
  { id: "web-design", title: "Web Design", price: "From ₹15,000", description: "Conversion-focused designs delivered as pixel-perfect Figma mockups before a single line of code is written.", includes: ["Wireframing & UX flow", "High-fidelity Figma mockups", "Mobile-first responsive design", "Design system & style guide", "2 rounds of revisions"] },
  { id: "wordpress-dev", title: "WordPress Development", price: "From ₹20,000", description: "Fast, SEO-ready WordPress sites with custom themes. Hand-coded — zero page-builder bloat.", includes: ["Custom theme development", "WooCommerce / LMS support", "Performance optimisation", "On-page SEO setup", "12 months of support"] },
  { id: "nextjs-dev", title: "Next.js Development", price: "From ₹40,000", description: "Modern web applications with Next.js 14 App Router, TypeScript, Prisma and Tailwind — SSR, SSG and API routes included.", includes: ["Next.js 14 App Router", "TypeScript + Tailwind CSS", "MySQL / Prisma ORM", "Authentication & dashboard", "Deployment & CI/CD setup"] },
  { id: "branding", title: "Branding & Identity", price: "From ₹12,000", description: "Logo design, brand guidelines, colour systems and typography that make you instantly recognizable.", includes: ["Logo design (3 concepts)", "Brand guidelines PDF", "Colour & type system", "Business card / stationery", "Social media kit"] },
  { id: "3d-cgi", title: "3D & CGI Production", price: "From ₹8,000", description: "Product visualization, CGI ads and 3D motion graphics. 40+ campaigns delivered using Blender and Cinema 4D.", includes: ["Product 3D modelling", "Photorealistic rendering", "CGI ad compositing", "Motion graphics & animation", "Final export in all formats"] },
  { id: "seo", title: "SEO & Monetization", price: "From ₹10,000", description: "Technical SEO audits, content strategy, AdSense and affiliate setup. My platforms hit 75K+ monthly impressions.", includes: ["Full technical SEO audit", "Keyword research & strategy", "Google AdSense setup", "Site speed optimisation", "Monthly reporting"] },
];

// Icons matched by index
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

export function ServicesGrid({ content }: { content?: { services: ServiceCard[] } }) {
  const services = content?.services ?? DEFAULT_SERVICES;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = ref.current?.querySelectorAll<HTMLElement>(".sg-card");
    cards?.forEach((card, i) => {
      gsap.from(card, {
        y: 32, duration: 0.6, ease: "power2.out",
        delay: (i % 3) * 0.1,
        scrollTrigger: { trigger: card, start: "top 92%", once: true },
      });
    });
  }, []);

  return (
    <section ref={ref} className="py-16 bg-[var(--color-bg)]" aria-label="All Services">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ id, title, price, description, includes }, idx) => (
            <div key={id} className="sg-card card p-7 flex flex-col gap-5 group">
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-[var(--color-accent)] flex-shrink-0"
                style={{ background: "var(--color-accent-light)" }}
              >
                {SERVICE_ICONS[idx] ?? SERVICE_ICONS[0]}
              </div>

              {/* Title + Price */}
              <div>
                <h2 className="font-display font-bold text-[var(--color-ink)] text-[19px] leading-tight mb-1 group-hover:text-[var(--color-accent)] transition-colors duration-200">
                  {title}
                </h2>
                <span className="font-body text-[12px] font-semibold text-[var(--color-accent)] uppercase tracking-[1.5px]">
                  {price}
                </span>
              </div>

              {/* Description */}
              <p className="font-body text-[var(--color-muted)] text-[14px] leading-relaxed">
                {description}
              </p>

              {/* Includes list */}
              <ul className="flex flex-col gap-2 flex-1">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
                      <circle cx="7" cy="7" r="6" fill="var(--color-accent-light)"/>
                      <path d="M4.5 7l2 2 3-3" stroke="var(--color-accent)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-body text-[13px] text-[var(--color-ink)]">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/contact-us/"
                className="btn-primary mt-2"
              >
                Get a Quote
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
