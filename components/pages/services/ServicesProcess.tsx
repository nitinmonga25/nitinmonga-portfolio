"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export interface ServicesProcessContent {
  heading: string;
  steps: ProcessStep[];
}

const DEFAULT: ServicesProcessContent = {
  heading: "My Process",
  steps: [
    { num: "01", title: "Discovery Call", desc: "We talk through your goals, timeline and budget. I ask the right questions to understand the scope before sending any proposal." },
    { num: "02", title: "Proposal & Kickoff", desc: "You receive a detailed proposal with deliverables, milestones and price. On approval, I send the contract and we begin." },
    { num: "03", title: "Design Phase", desc: "I build mockups in Figma first — you see exactly what you're getting before development starts. No surprises." },
    { num: "04", title: "Build & Review", desc: "Development begins on the approved design. You get a live staging URL to review at every milestone." },
    { num: "05", title: "Launch & Handover", desc: "Once approved, I handle the full deployment. You get all source files, credentials and a recorded walkthrough." },
  ],
};

export function ServicesProcess({ content }: { content?: ServicesProcessContent }) {
  const c = { ...DEFAULT, ...content };
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const steps = ref.current?.querySelectorAll<HTMLElement>(".sp-step");
    steps?.forEach((step, i) =>
      gsap.from(step, {
        y: 24, duration: 0.55, ease: "power2.out",
        delay: i * 0.1,
        scrollTrigger: { trigger: step, start: "top 92%", once: true },
      })
    );
  }, []);

  return (
    <section ref={ref} className="py-20 bg-[var(--color-bg)]" aria-label="Process">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="mb-12">
          <p className="section-label mb-4">{"// How It Works"}</p>
          <h2 className="font-display font-bold text-[var(--color-ink)]" style={{ fontSize: "clamp(32px, 4vw, 54px)" }}>
            {c.heading}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {c.steps.map(({ num, title, desc }, i) => (
            <div key={num} className="sp-step card p-6 flex flex-col gap-4 relative">
              {/* Step number */}
              <span
                className="font-display font-bold text-[var(--color-accent-light)] leading-none select-none"
                style={{ fontSize: "clamp(40px, 4vw, 56px)" }}
                aria-hidden="true"
              >
                {num}
              </span>

              <h3 className="font-display font-bold text-[var(--color-ink)] text-[16px] leading-tight">
                {title}
              </h3>
              <p className="font-body text-[var(--color-muted)] text-[13px] leading-relaxed">
                {desc}
              </p>

              {/* Arrow connector (not on last) */}
              {i < c.steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5h6M6 2.5l2.5 2.5L6 7.5" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
