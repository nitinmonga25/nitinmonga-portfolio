"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ContactFormContent {
  heading: string;
  subtitle: string;
  steps: Array<{ num: string; label: string }>;
}

const DEFAULT: ContactFormContent = {
  heading: "Tell me about your project",
  subtitle: "Fill in the form and I'll get back to you within 24 hours with a response and next steps.",
  steps: [
    { num: "01", label: "Fill the form" },
    { num: "02", label: "I respond within 24h" },
    { num: "03", label: "Discovery call" },
    { num: "04", label: "Proposal sent" },
  ],
};

const SERVICES = [
  "Web Design (Figma)",
  "WordPress Development",
  "Next.js Development",
  "Branding & Logo",
  "3D / CGI Production",
  "SEO & Monetization",
  "Other",
];

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactForm({ content }: { content?: ContactFormContent }) {
  const c = { ...DEFAULT, ...content };
  const ref = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [values, setValues] = useState({
    name: "", email: "", phone: "", service: "", budget: "", message: "",
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".cf-form", {
      y: 28, duration: 0.7, ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 95%", once: true },
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setFormState(res.ok ? "sent" : "error");
    } catch {
      setFormState("error");
    }
  };

  const inputClass = "w-full font-body text-[14px] text-[var(--color-ink)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[10px] px-4 py-3 outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/15 transition-all duration-200 placeholder:text-[var(--color-muted)]";

  return (
    <section ref={ref} className="pb-24 bg-[var(--color-bg)]" aria-label="Contact Form">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">

          {/* Left sidebar */}
          <div className="lg:sticky lg:top-28 self-start">
            <h2 className="font-display font-bold text-[var(--color-ink)] mb-4" style={{ fontSize: "clamp(24px, 2.5vw, 36px)" }}>
              {c.heading}
            </h2>
            <p className="font-body text-[var(--color-muted)] text-[14px] leading-relaxed mb-8">
              {c.subtitle}
            </p>

            <div className="flex flex-col gap-3">
              {c.steps.map(({ num, label }) => (
                <div key={num} className="flex items-center gap-3">
                  <span className="font-body text-[11px] font-semibold text-[var(--color-accent)] w-7 flex-shrink-0">{num}</span>
                  <span className="font-body text-[14px] text-[var(--color-ink)]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="cf-form card p-8">
            {formState === "sent" ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "var(--color-accent-light)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12l5 5L19 7" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-display font-bold text-[var(--color-ink)] text-[22px]">Message Sent!</h3>
                <p className="font-body text-[var(--color-muted)] text-[15px] max-w-sm">
                  Thanks for reaching out. I'll respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-[12px] font-semibold uppercase tracking-[1.5px] text-[var(--color-muted)]" htmlFor="name">
                      Full Name *
                    </label>
                    <input
                      id="name" name="name" type="text" required
                      placeholder="Your name"
                      value={values.name} onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-[12px] font-semibold uppercase tracking-[1.5px] text-[var(--color-muted)]" htmlFor="phone">
                      Phone Number *
                    </label>
                    <input
                      id="phone" name="phone" type="tel" required
                      placeholder="+91 98765 43210"
                      value={values.phone} onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[12px] font-semibold uppercase tracking-[1.5px] text-[var(--color-muted)]" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    id="email" name="email" type="email" required
                    placeholder="you@example.com"
                    value={values.email} onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-[12px] font-semibold uppercase tracking-[1.5px] text-[var(--color-muted)]" htmlFor="service">
                      Service Needed
                    </label>
                    <select
                      id="service" name="service"
                      value={values.service} onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a service…</option>
                      {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-[12px] font-semibold uppercase tracking-[1.5px] text-[var(--color-muted)]" htmlFor="budget">
                      Approximate Budget
                    </label>
                    <select
                      id="budget" name="budget"
                      value={values.budget} onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a range…</option>
                      <option value="under-10k">Under ₹10,000</option>
                      <option value="10k-30k">₹10,000 – ₹30,000</option>
                      <option value="30k-75k">₹30,000 – ₹75,000</option>
                      <option value="75k-150k">₹75,000 – ₹1,50,000</option>
                      <option value="150k+">₹1,50,000+</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[12px] font-semibold uppercase tracking-[1.5px] text-[var(--color-muted)]" htmlFor="message">
                    Project Details *
                  </label>
                  <textarea
                    id="message" name="message" required rows={5}
                    placeholder="Tell me about your project, goals and timeline…"
                    value={values.message} onChange={handleChange}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {formState === "error" && (
                  <p className="font-body text-[13px] text-[var(--color-accent)]">
                    Something went wrong. Please try emailing nitinmonga14@gmail.com directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="btn-primary self-start"
                >
                  {formState === "sending" ? "Sending…" : "Send Message"}
                  {formState !== "sending" && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
