"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface AboutContent {
  heading: string;
  bioParagraphs: string[];
  chips: string[];
  timeline: Array<{ year: string; title: string; desc: string }>;
}

const DEFAULT: AboutContent = {
  heading: "Designer, Developer &\n3D Artist",
  bioParagraphs: [
    "I'm Nitin Monga — a graphic designer, 3D artist and full-stack developer based in Punjab, India.",
    "Over the past decade I've built 400+ websites, produced 40+ CGI ad campaigns, and grown a network of live platforms to 84K+ followers and 75K+ monthly impressions.",
    "I run a design and development studio in Punjab — blending editorial aesthetics with technical precision to build things that look great and perform even better.",
    "Every project I take on is built to perform, convert, and last.",
  ],
  chips: ["Figma", "Next.js", "WordPress", "Blender", "GSAP", "Prisma"],
  timeline: [
    { year: "2013", title: "First Design Freelance", desc: "Started freelancing as a graphic designer — logos, brochures, and brand identities for local Punjab businesses." },
    { year: "2015", title: "First Digital Platform", desc: "Built and launched a niche content platform from scratch. It grew to 40,000+ monthly active users over the next decade." },
    { year: "2017", title: "Entered Web Development", desc: "Mastered WordPress, PHP and MySQL. Started building full client websites professionally — 400+ delivered since." },
    { year: "2019", title: "3D & CGI Production", desc: "Expanded into 3D advertising. Delivered 40+ CGI campaigns for brands across India using Blender and Cinema 4D." },
    { year: "2021", title: "Founded My Studio", desc: "Registered a formal design and development studio in Punjab. Scaled to larger contracts and a full-service offering." },
    { year: "2025", title: "84K+ Following", desc: "Grew combined social presence to 84,000+ across Instagram, YouTube and LinkedIn. 75K+ monthly platform impressions." },
  ],
};

export function About({ content }: { content?: AboutContent }) {
  const c = { ...DEFAULT, ...content };
  const sectionRef = useRef<HTMLElement>(null);
  const bioRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const paras = bioRef.current?.querySelectorAll<HTMLElement>(".bio-para");
    if (!paras) return;

    paras.forEach((p) => {
      gsap.from(p, {
        y: 28,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: p,
          start: "top 92%",
          once: true,
        },
      });
    });

    const milestones = sectionRef.current?.querySelectorAll<HTMLElement>(".milestone");
    milestones?.forEach((m) => {
      gsap.from(m, {
        x: -20,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: {
          trigger: m,
          start: "top 95%",
          once: true,
        },
      });
    });

  }, []);

  // Split heading on \n for line break support
  const headingLines = c.heading.split("\n");

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--color-bg)] py-24"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* ── Left: sticky photo + label ────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 flex flex-col">
            <p className="section-label mb-6">{"// About Me"}</p>

            {/* Photo placeholder — replace with next/image once photo is uploaded */}
            <div
              className="relative w-full aspect-[4/5] max-w-sm rounded-2xl overflow-hidden bg-[var(--color-gold-light)] border border-[var(--color-border)]"
              aria-label="Nitin Monga portrait"
            >
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <p className="font-display text-3xl font-bold text-[var(--color-gold-dark)]">NM</p>
                  <p className="font-body text-[13px] text-[var(--color-muted)] mt-1">
                    Photo coming soon
                  </p>
                </div>
              </div>
              <svg
                className="absolute top-4 right-4 opacity-30"
                width="80"
                height="80"
                aria-hidden="true"
              >
                {Array.from({ length: 25 }, (_, i) => (
                  <circle
                    key={i}
                    cx={(i % 5) * 18 + 4}
                    cy={Math.floor(i / 5) * 18 + 4}
                    r="1.5"
                    fill="var(--color-gold)"
                  />
                ))}
              </svg>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 mt-6 max-w-sm">
              {c.chips.map((tag) => (
                <span
                  key={tag}
                  className="font-body text-[12px] px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: bio + timeline (scrolls normally) ──────────────────── */}
          <div className="mt-12 lg:mt-0 flex flex-col gap-16">

            {/* Bio paragraphs */}
            <div ref={bioRef} className="flex flex-col gap-6">
              <h2
                id="about-heading"
                className="font-display font-bold text-[var(--color-ink)] leading-tight"
                style={{ fontSize: "clamp(32px, 3.8vw, 52px)" }}
              >
                {headingLines[0]}
                {headingLines[1] && (
                  <>
                    <br />
                    <span className="text-[var(--color-gold)]">{headingLines[1]}</span>
                  </>
                )}
              </h2>

              {c.bioParagraphs.map((text, i) => (
                <p
                  key={i}
                  className="bio-para font-body text-[var(--color-muted)] leading-[1.8]"
                  style={{ fontSize: "clamp(15px, 1.1vw, 17px)" }}
                >
                  {text}
                </p>
              ))}

              <div className="flex gap-4 mt-2">
                <a href="/about-me/" className="btn-primary">
                  Full Story
                </a>
                <a href="/work/" className="btn-secondary">
                  See My Work
                </a>
              </div>
            </div>

            {/* Career timeline */}
            <div>
              <p className="section-label mb-8">{"// Career Timeline"}</p>
              <div className="relative flex flex-col gap-0 pl-8">
                {/* Gold vertical line */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-[var(--color-gold)]/30" />

                {c.timeline.map(({ year, title, desc }) => (
                  <div key={year} className="milestone relative pb-10 last:pb-0">
                    {/* Gold dot on the line */}
                    <div className="absolute -left-[33px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--color-gold)] border-2 border-[var(--color-bg)]" />

                    <span className="font-body text-[var(--color-gold)] text-[12px] font-600 uppercase tracking-[2px]">
                      {year}
                    </span>
                    <h3 className="font-display text-[var(--color-ink)] font-bold text-lg mt-1 mb-1">
                      {title}
                    </h3>
                    <p className="font-body text-[var(--color-muted)] text-[14px] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
