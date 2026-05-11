"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const DEFAULT_STATS: StatItem[] = [
  { value: 84, suffix: "K+", label: "Social Followers" },
  { value: 400, suffix: "+", label: "Websites Built" },
  { value: 75, suffix: "K+", label: "Graphics Created" },
  { value: 40, suffix: "+", label: "CGI Ads Produced" },
];

// Icons are hardcoded by index position and cannot be stored in JSON
const ICONS = [
  <svg key="0" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="14" cy="6" r="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 16c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M14 11c2 .5 4 2 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>,
  <svg key="1" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M2 7h16" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5.5 5h.5M7.5 5h.5M9.5 5h.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M6 11h8M6 14h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 15L8 9l3 3 3-4 5 7H3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="14.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2L18 6.5v7L10 18 2 13.5v-7L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M10 2v16M2 6.5l8 5 8-5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>,
];

export function Stats({ content }: { content?: StatItem[] }) {
  const stats = content ?? DEFAULT_STATS;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const nums = sectionRef.current?.querySelectorAll<HTMLElement>(".stat-num");
    if (!nums) return;

    nums.forEach((el, i) => {
      const target = stats[i]?.value ?? 0;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        onUpdate() { el.textContent = Math.round(obj.val).toString(); },
      });
    });

    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".stat-card");
    cards?.forEach((card, i) => {
      gsap.from(card, {
        y: 24, duration: 0.55, ease: "power2.out",
        delay: i * 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 95%", once: true },
      });
    });
  }, [stats]);

  return (
    <section ref={sectionRef} className="py-16 bg-[var(--color-bg)]" aria-label="Statistics">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ value, suffix, label }, idx) => (
            <div
              key={label}
              className="stat-card card flex flex-col items-center text-center p-6 lg:p-8 gap-3"
            >
              {/* Icon in accent-light circle */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-accent)]"
                style={{ background: "var(--color-accent-light)" }}
              >
                {ICONS[idx] ?? ICONS[0]}
              </div>

              {/* Number */}
              <p
                className="font-display font-bold text-[var(--color-ink)] leading-none"
                style={{ fontSize: "clamp(40px, 4.5vw, 64px)" }}
              >
                <span className="stat-num">0</span>
                <span className="text-[var(--color-accent)]">{suffix}</span>
              </p>

              {/* Label */}
              <p
                className="font-body text-[var(--color-muted)] uppercase tracking-[2px]"
                style={{ fontSize: "10.5px" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
