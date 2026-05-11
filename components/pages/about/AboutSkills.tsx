"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface SkillGroup {
  category: string;
  items: Array<{ name: string; level: number }>;
}

export interface AboutSkillsContent {
  groups: SkillGroup[];
}

const DEFAULT: AboutSkillsContent = {
  groups: [
    {
      category: "Design",
      items: [
        { name: "Figma", level: 95 },
        { name: "Adobe Illustrator", level: 92 },
        { name: "Adobe Photoshop", level: 90 },
        { name: "Adobe InDesign", level: 80 },
      ],
    },
    {
      category: "3D & Motion",
      items: [
        { name: "Blender", level: 88 },
        { name: "Cinema 4D", level: 82 },
        { name: "After Effects", level: 78 },
      ],
    },
    {
      category: "Development",
      items: [
        { name: "Next.js / React", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "WordPress / PHP", level: 93 },
        { name: "Tailwind CSS", level: 92 },
        { name: "MySQL / Prisma", level: 82 },
      ],
    },
    {
      category: "Marketing & SEO",
      items: [
        { name: "Technical SEO", level: 87 },
        { name: "Google AdSense", level: 84 },
        { name: "Google Analytics", level: 80 },
      ],
    },
  ],
};

export function AboutSkills({ content }: { content?: AboutSkillsContent }) {
  const c = { groups: content?.groups ?? DEFAULT.groups };
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const bars = ref.current?.querySelectorAll<HTMLElement>(".skill-fill");
    bars?.forEach((bar) => {
      const target = bar.dataset.level ?? "0";
      gsap.from(bar, {
        width: "0%", duration: 1.1, ease: "power2.out",
        scrollTrigger: { trigger: bar, start: "top 90%", once: true },
      });
      gsap.to(bar, {
        width: `${target}%`, duration: 1.1, ease: "power2.out",
        scrollTrigger: { trigger: bar, start: "top 90%", once: true },
      });
    });

    const groups = ref.current?.querySelectorAll<HTMLElement>(".skill-group");
    groups?.forEach((g, i) => {
      gsap.from(g, {
        y: 24, duration: 0.55, ease: "power2.out",
        delay: i * 0.1,
        scrollTrigger: { trigger: g, start: "top 92%", once: true },
      });
    });
  }, []);

  return (
    <section ref={ref} className="py-20 bg-[var(--color-bg)]" aria-label="Skills">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="mb-12">
          <p className="section-label mb-4">{"// Toolkit"}</p>
          <h2
            className="font-display font-bold text-[var(--color-ink)]"
            style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
          >
            Skills & Tools
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {c.groups.map(({ category, items }) => (
            <div key={category} className="skill-group card p-6 flex flex-col gap-5">
              <p className="section-label">{category}</p>
              <div className="flex flex-col gap-4">
                {items.map(({ name, level }) => (
                  <div key={name}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-[13px] text-[var(--color-ink)]">{name}</span>
                      <span className="font-body text-[12px] text-[var(--color-muted)]">{level}%</span>
                    </div>
                    <div className="h-1 bg-[var(--color-accent-light)] rounded-full overflow-hidden">
                      <div
                        className="skill-fill h-full bg-[var(--color-accent)] rounded-full"
                        data-level={level}
                        style={{ width: "0%" }}
                        aria-valuenow={level}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                        aria-label={name}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
