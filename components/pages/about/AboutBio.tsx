"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface AboutBioContent {
  sectionHeading: string;
  paragraphs: string[];
  services: string[];
}

const DEFAULT: AboutBioContent = {
  sectionHeading: "More than a portfolio page.",
  paragraphs: [
    "I'm Nitin Monga — a graphic designer, 3D artist and full-stack developer based in Punjab, India. I've been building digital products professionally since 2013.",
    "Over the past decade I've delivered 400+ websites across WordPress and Next.js, produced 40+ CGI advertising campaigns for brands across India, and grown a network of digital platforms to 84K+ followers.",
    "My work sits at the intersection of aesthetics and engineering. I care about how things look, how they perform, and how they convert — not just one of the three.",
    "I run a full-service design and development studio in Punjab. Whether you need a brand identity, a high-performance website, or a 3D product campaign, I handle it end-to-end.",
  ],
  services: [
    "Web Design & Figma Mockups",
    "WordPress & Next.js Development",
    "Brand Identity & Logo Design",
    "3D Product Visualization",
    "CGI Advertising (Blender / C4D)",
    "SEO, AdSense & Monetization",
  ],
};

export function AboutBio({ content }: { content?: AboutBioContent }) {
  const c = { ...DEFAULT, ...content };
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const paras = ref.current?.querySelectorAll<HTMLElement>(".bio-p");
    paras?.forEach((p) =>
      gsap.from(p, {
        y: 28, duration: 0.65, ease: "power2.out",
        scrollTrigger: { trigger: p, start: "top 92%", once: true },
      })
    );
  }, []);

  return (
    <section ref={ref} className="py-16 bg-[var(--color-bg)]" aria-label="Biography">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Left label */}
          <div className="lg:sticky lg:top-28">
            <p className="section-label mb-4">{"// Who I Am"}</p>
            <h2
              className="font-display font-bold text-[var(--color-ink)] leading-tight"
              style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
            >
              {c.sectionHeading}
            </h2>
            {/* Decorative accent bar */}
            <div className="w-12 h-1 bg-[var(--color-accent)] rounded-full mt-5" aria-hidden="true" />
          </div>

          {/* Right: paragraphs */}
          <div className="flex flex-col gap-6">
            {c.paragraphs.map((text, i) => (
              <p
                key={i}
                className="bio-p font-body text-[var(--color-muted)] text-[16px] leading-[1.8]"
              >
                {text}
              </p>
            ))}

            {/* Services quick-list */}
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {c.services.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" aria-hidden="true" />
                  <span className="font-body text-[14px] text-[var(--color-ink)]">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
