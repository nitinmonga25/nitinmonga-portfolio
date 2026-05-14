"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface AboutContent {
  heading: string;
  bioParagraphs: string[];
  chips: string[];
  timeline: Array<{ year: string; title: string; desc: string }>;
  photo?: string;
}

const DEFAULT: AboutContent = {
  heading: "Designer, Developer &\n3D Artist",
  photo: "",
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
  const sectionRef  = useRef<HTMLElement>(null);
  const bioRef      = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);
  const shineRef     = useRef<HTMLDivElement>(null);
  const dotsRef      = useRef<HTMLDivElement>(null);
  const badgeRef     = useRef<HTMLDivElement>(null);
  const circleRef    = useRef<HTMLDivElement>(null);

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

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const wrap = photoWrapRef.current;
    const card = photoCardRef.current;
    if (!wrap || !card) return;

    const rect = wrap.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const nx = (cx / rect.width  - 0.5) * 2;
    const ny = (cy / rect.height - 0.5) * 2;

    gsap.to(card, {
      rotateX: -ny * 13,
      rotateY:  nx * 13,
      transformPerspective: 900,
      duration: 0.25,
      ease: "power2.out",
    });

    if (shineRef.current) {
      const px = (cx / rect.width)  * 100;
      const py = (cy / rect.height) * 100;
      shineRef.current.style.background =
        `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.22) 0%, transparent 62%)`;
    }

    if (dotsRef.current)  gsap.to(dotsRef.current,  { x: nx * -14, y: ny * -10, duration: 0.4, ease: "power2.out" });
    if (circleRef.current) gsap.to(circleRef.current, { x: nx * 18,  y: ny * 14,  duration: 0.45, ease: "power2.out" });
    if (badgeRef.current)  gsap.to(badgeRef.current,  { x: nx * -22, y: ny * -18, duration: 0.35, ease: "power2.out" });
  }

  function handleMouseLeave() {
    const card = photoCardRef.current;
    if (!card) return;
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
    if (shineRef.current)  shineRef.current.style.background = "none";
    if (dotsRef.current)   gsap.to(dotsRef.current,   { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    if (circleRef.current) gsap.to(circleRef.current,  { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    if (badgeRef.current)  gsap.to(badgeRef.current,   { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
  }

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

            {/* 3D scene wrapper */}
            <div
              ref={photoWrapRef}
              className="relative w-full"
              style={{ perspective: "900px", cursor: "crosshair" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Floating dots — layer behind card, moves opposite */}
              <div
                ref={dotsRef}
                className="absolute -top-5 -right-5 pointer-events-none"
                style={{ zIndex: 0, willChange: "transform" }}
                aria-hidden="true"
              >
                <svg width="88" height="88" viewBox="0 0 88 88">
                  {Array.from({ length: 25 }, (_, i) => (
                    <circle
                      key={i}
                      cx={(i % 5) * 20 + 4}
                      cy={Math.floor(i / 5) * 20 + 4}
                      r="2"
                      fill="var(--color-accent)"
                      opacity="0.35"
                    />
                  ))}
                </svg>
              </div>

              {/* Floating ring — moves forward with cursor */}
              <div
                ref={circleRef}
                className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full pointer-events-none"
                style={{
                  border: "2px solid var(--color-accent)",
                  opacity: 0.5,
                  zIndex: 10,
                  willChange: "transform",
                }}
                aria-hidden="true"
              />

              {/* Floating "Available" badge — moves opposite to cursor */}
              <div
                ref={badgeRef}
                className="absolute -top-3 -left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full pointer-events-none"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  zIndex: 10,
                  willChange: "transform",
                }}
                aria-hidden="true"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-body text-[11px] font-semibold text-[var(--color-ink)]">Available for hire</span>
              </div>

              {/* The card — tilts with mouse */}
              <div
                ref={photoCardRef}
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--color-border)]"
                style={{
                  background: c.photo ? "transparent" : "var(--color-gold-light)",
                  willChange: "transform",
                  zIndex: 1,
                }}
                aria-label="Nitin Monga portrait"
              >
                {c.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.photo}
                    alt="Nitin Monga"
                    className="w-full h-full object-cover"
                    style={{ transform: "translateZ(0)" }}
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-end p-6">
                      <div>
                        <p className="font-display text-3xl font-bold text-[var(--color-gold-dark)]">NM</p>
                        <p className="font-body text-[13px] text-[var(--color-muted)] mt-1">Photo coming soon</p>
                      </div>
                    </div>
                    {/* Inner dot grid decoration */}
                    <svg className="absolute top-4 right-4 opacity-20" width="80" height="80" aria-hidden="true">
                      {Array.from({ length: 25 }, (_, i) => (
                        <circle key={i} cx={(i % 5) * 18 + 4} cy={Math.floor(i / 5) * 18 + 4} r="1.5" fill="var(--color-gold)" />
                      ))}
                    </svg>
                  </>
                )}

                {/* Shine overlay — follows cursor */}
                <div
                  ref={shineRef}
                  className="absolute inset-0 pointer-events-none"
                  style={{ borderRadius: "inherit", transition: "background 0.05s linear" }}
                />

                {/* Subtle inner shadow at edges for depth */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 40px rgba(0,0,0,0.08)",
                    borderRadius: "inherit",
                  }}
                />
              </div>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 mt-8">
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
