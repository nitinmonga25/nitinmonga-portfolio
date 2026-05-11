"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ContactContent {
  heading: string;
  body: string;
  email: string;
  location: string;
}

const DEFAULT: ContactContent = {
  heading: "Have a Project\nin Mind?",
  body: "Whether you need a website, brand identity, 3D campaign, or SEO strategy — I'd love to hear about it.",
  email: "nitinmonga14@gmail.com",
  location: "Punjab, India",
};

export function Contact({ content }: { content?: ContactContent }) {
  const c = { ...DEFAULT, ...content };
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".contact-headline", {
      y: 28, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 95%", once: true },
    });

    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".contact-card");
    cards?.forEach((card, i) => {
      gsap.from(card, {
        y: 20, duration: 0.55, ease: "power2.out",
        delay: i * 0.12,
        scrollTrigger: { trigger: card, start: "top 98%", once: true },
      });
    });
  }, []);

  const headingLines = c.heading.split("\n");

  const CONTACT_OPTIONS = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M4 4h14c1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.4"/>
          <polyline points="20,6 11,12 2,6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      ),
      label: "Email",
      value: c.email,
      href: `mailto:${c.email}`,
      cta: "Send Email",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M11 2a8 8 0 00-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 00-8-8z" stroke="currentColor" strokeWidth="1.4"/>
          <circle cx="11" cy="10" r="3" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
      ),
      label: "Location",
      value: c.location,
      href: "/contact-us/",
      cta: "View Contact Page",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[var(--color-bg)]"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Bold accent banner */}
        <div
          className="contact-headline rounded-[20px] px-8 md:px-14 py-14 md:py-16 mb-12 relative overflow-hidden"
          style={{ background: "var(--color-accent)" }}
        >
          {/* Background dot grid in accent banner */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[3px] text-white/70 mb-4">
                {"// Let's Work Together"}
              </p>
              <h2
                id="contact-heading"
                className="font-display font-bold text-white leading-tight"
                style={{ fontSize: "clamp(32px, 4.5vw, 60px)" }}
              >
                {headingLines[0]}
                {headingLines[1] && <><br />{headingLines[1]}</>}
              </h2>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <p className="font-body text-white/75 text-[15px] max-w-[340px] leading-relaxed">
                {c.body}
              </p>
              <Link
                href="/contact-us/"
                className="inline-flex items-center gap-2 font-body text-[14px] font-semibold bg-white text-[var(--color-accent)] px-6 py-3 rounded-[8px] hover:bg-[var(--color-accent-light)] transition-colors duration-200 self-start md:self-auto"
              >
                Send a Message
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact option cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {CONTACT_OPTIONS.map(({ icon, label, value, href, cta }) => (
            <a
              key={label}
              href={href}
              className="contact-card card flex flex-col gap-3 px-6 py-6 group hover:border-[var(--color-accent)] transition-colors duration-200"
            >
              <div className="text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-200">
                {icon}
              </div>
              <p className="font-body text-[10.5px] uppercase tracking-[2px] text-[var(--color-muted)]">
                {label}
              </p>
              <p className="font-body text-[14px] font-medium text-[var(--color-ink)]">
                {value}
              </p>
              <p className="font-body text-[13px] text-[var(--color-accent)] mt-auto flex items-center gap-1.5">
                {cta}
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                  <path d="M1.5 5.5h8M6.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </p>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
