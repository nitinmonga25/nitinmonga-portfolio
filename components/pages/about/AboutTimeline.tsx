"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export interface AboutTimelineContent {
  heading: string;
  milestones: Milestone[];
}

const DEFAULT: AboutTimelineContent = {
  heading: "A Decade of Building",
  milestones: [
    { year: "2013", title: "First Freelance Project", desc: "Started as a graphic designer — logos, brochures and brand identities for local Punjab businesses. Built a client base from zero." },
    { year: "2015", title: "First Digital Platform", desc: "Built and launched a niche content platform from scratch. Grew it to 40,000+ monthly active users using content strategy and SEO." },
    { year: "2017", title: "Full-Stack Web Development", desc: "Mastered WordPress, PHP and MySQL. Began delivering complete client websites professionally. 400+ sites delivered since." },
    { year: "2019", title: "3D & CGI Production", desc: "Expanded into 3D advertising. Delivered 40+ CGI campaigns for brands across India using Blender and Cinema 4D." },
    { year: "2021", title: "Studio Founded", desc: "Registered a formal design and development studio in Punjab. Scaled to larger enterprise contracts and a full-service offering." },
    { year: "2023", title: "Next.js & Modern Stack", desc: "Shifted primary development to Next.js 14 App Router, TypeScript and Tailwind. Built high-performance SSR applications at scale." },
    { year: "2025", title: "84K+ Community", desc: "Grew combined social presence to 84,000+ across Instagram, YouTube and LinkedIn. 75K+ monthly platform impressions." },
  ],
};

export function AboutTimeline({ content }: { content?: AboutTimelineContent }) {
  const c = { ...DEFAULT, ...content };
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const items = ref.current?.querySelectorAll<HTMLElement>(".tl-item");
    items?.forEach((item) => {
      gsap.from(item, {
        x: -24, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: item, start: "top 92%", once: true },
      });
    });
  }, []);

  return (
    <section ref={ref} className="py-20 bg-[var(--color-bg)]" aria-label="Career Timeline">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="mb-12">
          <p className="section-label mb-4">{"// Journey"}</p>
          <h2
            className="font-display font-bold text-[var(--color-ink)]"
            style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
          >
            {c.heading}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[56px] top-0 bottom-0 w-px bg-[var(--color-border)] hidden sm:block"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-0">
            {c.milestones.map(({ year, title, desc }, i) => (
              <div
                key={year}
                className={`tl-item flex gap-6 sm:gap-10 relative pb-8 ${i === c.milestones.length - 1 ? "" : ""}`}
              >
                {/* Year + dot */}
                <div className="flex flex-col items-center gap-0 flex-shrink-0 sm:w-[56px]">
                  <div
                    className="w-3 h-3 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-bg)] relative z-10 mt-1.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div className="card p-6 flex-1 mb-0">
                  <span className="font-body text-[11px] font-semibold uppercase tracking-[2px] text-[var(--color-accent)] block mb-2">
                    {year}
                  </span>
                  <h3 className="font-display font-bold text-[var(--color-ink)] text-[17px] mb-2">
                    {title}
                  </h3>
                  <p className="font-body text-[var(--color-muted)] text-[14px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex items-center gap-4">
          <Link href="/work/" className="btn-primary">
            See My Work
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link href="/contact-us/" className="btn-secondary">
            Get in Touch
          </Link>
        </div>

      </div>
    </section>
  );
}
