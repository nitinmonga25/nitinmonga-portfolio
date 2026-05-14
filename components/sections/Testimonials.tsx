"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Rahul Sharma",
    role: "Founder, TechStartup India",
    quote: "Nitin delivered a Next.js application that exceeded every expectation. The attention to detail in both design and code is exceptional. Our conversion rate improved by 40% after launch.",
    rating: 5,
  },
  {
    name: "Priya Kapoor",
    role: "Marketing Director, BrandCo",
    quote: "The CGI campaign Nitin produced for our product launch was world-class. We've worked with agencies that charge 10x more and delivered less. Genuinely talented.",
    rating: 5,
  },
  {
    name: "James Mitchell",
    role: "CEO, UK E-commerce Brand",
    quote: "Our WordPress site went from slow and dated to fast and beautiful in three weeks. Nitin handles design, code and SEO with zero handoff friction. Rare find.",
    rating: 5,
  },
  {
    name: "Ananya Singh",
    role: "Content Creator, 200K Followers",
    quote: "The personal brand identity Nitin created is exactly who I am. He understood the brief on the first call and nailed it. I get compliments on my branding constantly.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "CTO, SaaS Platform",
    quote: "Clean TypeScript, proper Prisma schema, excellent component architecture. Nitin doesn't just build things — he builds them right. We've extended the contract twice.",
    rating: 5,
  },
  {
    name: "Meera Patel",
    role: "Business Owner, Punjab",
    quote: "From logo to website to Google rankings — Nitin handled everything. Within 6 months we were on page 1 for our main keywords. Absolutely worth every rupee.",
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 13 13"
          aria-hidden="true"
        >
          <path
            d="M6.5 1l1.4 2.9 3.1.5-2.25 2.2.53 3.1L6.5 8.15 3.72 9.7l.53-3.1L2 4.4l3.1-.5z"
            fill={i < rating ? "var(--color-accent)" : "var(--color-border)"}
            stroke={i < rating ? "var(--color-accent)" : "var(--color-border)"}
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        style={{ border: "2px solid var(--color-border)" }}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-display text-[12px] font-bold text-white select-none"
      style={{ background: "linear-gradient(135deg, var(--color-accent) 0%, #c73000 100%)" }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export function Testimonials({ content }: { content?: TestimonialItem[] }) {
  const items = content && content.length > 0 ? content : DEFAULT_TESTIMONIALS;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".testimonial-card");
    if (!cards) return;
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 30,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 95%", once: true },
        delay: (i % 3) * 0.1,
      });
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateZ(4px)`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[var(--color-surface)]"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-14">
          <p className="section-label mb-4">{"// Client Feedback"}</p>
          <h2
            id="testimonials-heading"
            className="font-display font-bold text-[var(--color-ink)]"
            style={{ fontSize: "clamp(36px, 4.5vw, 60px)" }}
          >
            What Clients Say
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="testimonial-card flex flex-col gap-5 p-7 rounded-[var(--radius-card)] cursor-default"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderTop: "3px solid var(--color-accent)",
                boxShadow: "var(--shadow-card)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                willChange: "transform",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Decorative quote mark */}
              <span
                className="font-display font-bold leading-none select-none"
                style={{
                  fontSize: "56px",
                  color: "var(--color-accent)",
                  lineHeight: "0.8",
                  opacity: 0.9,
                }}
                aria-hidden="true"
              >
                &ldquo;
              </span>

              {/* Quote */}
              <p
                className="font-body text-[15px] leading-relaxed flex-1"
                style={{ color: "var(--color-muted)", fontStyle: "italic" }}
              >
                {item.quote}
              </p>

              {/* Divider */}
              <div style={{ height: "1px", background: "var(--color-border)" }} />

              {/* Attribution row */}
              <div className="flex items-center gap-3">
                <Avatar name={item.name} avatar={item.avatar} />
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="font-display font-semibold text-[var(--color-ink)] text-[14px] leading-tight truncate">
                    {item.name}
                  </span>
                  <span
                    className="font-body text-[12px] truncate"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {item.role}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <Stars rating={item.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
