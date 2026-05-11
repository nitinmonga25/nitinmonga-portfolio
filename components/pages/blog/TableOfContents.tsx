"use client";

import { useEffect, useState } from "react";

interface Heading { id: string; text: string; level: number; }

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="sticky flex flex-col" style={{ top: "7rem" }}>
      <p
        className="font-body text-[10px] uppercase tracking-[3px] mb-4"
        style={{ color: "var(--color-muted)" }}
      >
        In this article
      </p>
      <div className="flex flex-col gap-0.5">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="group flex items-start gap-2.5 py-1 transition-all duration-200"
            style={{ paddingLeft: h.level === 3 ? "14px" : "0" }}
          >
            <span
              className="flex-shrink-0 mt-[7px] w-[5px] h-[5px] rounded-full transition-all duration-200"
              style={{
                background: active === h.id ? "var(--color-accent)" : "var(--color-border)",
                transform: active === h.id ? "scale(1.4)" : "scale(1)",
              }}
            />
            <span
              className="font-body text-[12px] leading-snug group-hover:text-[var(--color-accent)] transition-colors duration-200"
              style={{
                color: active === h.id ? "var(--color-accent)" : "var(--color-muted)",
                fontWeight: active === h.id ? "600" : "400",
              }}
            >
              {h.text}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
