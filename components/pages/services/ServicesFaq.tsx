"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ServicesFaqContent {
  heading: string;
  faqs: FaqItem[];
}

const DEFAULT: ServicesFaqContent = {
  heading: "Common Questions",
  faqs: [
    { q: "Do you work with international clients?", a: "Yes. I work with clients across India and internationally. All communication happens via email, WhatsApp or Zoom, and payments are accepted in INR and USD." },
    { q: "What's your typical turnaround time?", a: "A logo or brand identity takes 5–7 business days. A WordPress site takes 2–4 weeks. A full Next.js application is 4–8 weeks depending on complexity. Timelines are confirmed in the proposal." },
    { q: "Do you provide maintenance after launch?", a: "Yes. All web projects include 30 days of post-launch support. Extended maintenance retainers are available on a monthly basis." },
    { q: "How many revisions are included?", a: "Design projects include 2 rounds of revisions in the standard package. Additional rounds can be added to any package." },
    { q: "Can you handle both design and development?", a: "Absolutely — that's my main value proposition. I handle everything from Figma design to code to deployment, so there's no handoff friction between designer and developer." },
    { q: "What's the payment structure?", a: "I work on a 50% upfront, 50% on delivery model for most projects. Larger engagements use milestone-based payments split across the project." },
  ],
};

export function ServicesFaq({ content }: { content?: ServicesFaqContent }) {
  const c = { ...DEFAULT, ...content };
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".sf-header", {
      y: 24, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
    });
  }, []);

  return (
    <section ref={ref} className="py-20 bg-[var(--color-bg)]" aria-label="Frequently Asked Questions">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">

          {/* Left */}
          <div className="sf-header lg:sticky lg:top-28 self-start">
            <p className="section-label mb-4">{"// FAQ"}</p>
            <h2 className="font-display font-bold text-[var(--color-ink)] mb-6" style={{ fontSize: "clamp(28px, 3vw, 44px)" }}>
              {c.heading}
            </h2>
            <p className="font-body text-[var(--color-muted)] text-[14px] leading-relaxed mb-6">
              Still have questions? Send me a message and I'll reply within 24 hours.
            </p>
            <Link href="/contact-us/" className="btn-primary">
              Ask Me Directly
            </Link>
          </div>

          {/* Right: accordion */}
          <div className="flex flex-col gap-3">
            {c.faqs.map(({ q, a }, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-body font-semibold text-[var(--color-ink)] text-[15px]">{q}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className={`flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="M3 6l5 5 5-5" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {open === i && (
                  <div className="px-6 pb-6">
                    <p className="font-body text-[var(--color-muted)] text-[14px] leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
