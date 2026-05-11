"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export interface ContactHeroContent {
  title: string;
  subtitle: string;
  email: string;
  location: string;
  responseTime: string;
}

const DEFAULT: ContactHeroContent = {
  title: "Let's Build\nSomething.",
  subtitle: "Tell me about your project. I respond to every message within 24 hours.",
  email: "nitinmonga14@gmail.com",
  location: "Punjab, India",
  responseTime: "Within 24 hours",
};

export function ContactHero({ content }: { content?: ContactHeroContent }) {
  const c = { ...DEFAULT, ...content };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ch-label", { y: -12, duration: 0.5, delay: 0.1 });
      gsap.from(".ch-title", { y: 28, duration: 0.7, delay: 0.25, ease: "power3.out" });
      gsap.from(".ch-sub",   { y: 16, duration: 0.6, delay: 0.4 });
      gsap.from(".ch-info",  { y: 12, duration: 0.5, stagger: 0.1, delay: 0.55 });
    });
    return () => ctx.revert();
  }, []);

  const titleLines = c.title.split("\n");

  const INFO_ITEMS = [
    {
      label: "Email",
      value: c.email,
      href: `mailto:${c.email}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 3h12c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1z" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M15 4L8 9 1 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "Location",
      value: c.location,
      href: null as string | null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1.5a5 5 0 00-5 5c0 3.5 5 8.5 5 8.5s5-5 5-8.5a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="8" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
    },
    {
      label: "Response Time",
      value: c.responseTime,
      href: null as string | null,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M8 4.5V8.5L10.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="pt-28 pb-12 bg-[var(--color-bg)]" aria-labelledby="contact-page-heading">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="ch-label section-label mb-5">{"// Contact"}</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div>
            <h1
              id="contact-page-heading"
              className="ch-title font-display font-bold text-[var(--color-ink)] leading-[1.04] mb-5"
              style={{ fontSize: "clamp(40px, 6vw, 80px)", letterSpacing: "-0.03em" }}
            >
              {titleLines[0]}
              {titleLines[1] && (
                <>
                  <br />
                  <span className="text-[var(--color-accent)]">{titleLines[1]}</span>
                </>
              )}
            </h1>
            <p className="ch-sub font-body text-[var(--color-muted)] text-[16px] leading-relaxed max-w-lg">
              {c.subtitle}
            </p>
          </div>

          {/* Contact info cards */}
          <div className="flex flex-col gap-3">
            {INFO_ITEMS.map(({ label, value, href, icon }) => (
              <div key={label} className="ch-info card px-5 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-accent)] flex-shrink-0" style={{ background: "var(--color-accent-light)" }}>
                  {icon}
                </div>
                <div>
                  <p className="font-body text-[10.5px] uppercase tracking-[1.5px] text-[var(--color-muted)]">{label}</p>
                  {href ? (
                    <a href={href} className="font-body text-[13px] font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors duration-200">
                      {value}
                    </a>
                  ) : (
                    <p className="font-body text-[13px] font-medium text-[var(--color-ink)]">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
