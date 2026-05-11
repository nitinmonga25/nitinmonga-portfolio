"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "About", href: "/about-me/" },
  { label: "Services", href: "/services/" },
  { label: "Work", href: "/work/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact-us/" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1 group"
            aria-label="Nitin Monga Home"
          >
            <span className="font-display text-xl font-bold text-[var(--color-ink)] tracking-tight">
              NM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] group-hover:scale-150 transition-transform duration-200" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`accent-underline font-body text-[15px] font-medium transition-colors duration-200 ${
                  pathname === link.href ? "text-[var(--color-gold)]" : "text-[var(--color-ink)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link href="/contact-us/" className="hidden md:inline-flex btn-primary text-sm py-2.5 px-5">
              Hire Me
            </Link>
            <button
              className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-6 h-0.5 bg-[var(--color-ink)] transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-[var(--color-ink)] transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-[var(--color-ink)] transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--color-bg)] flex flex-col justify-center items-center transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-center gap-10" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-4xl font-bold text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors duration-200"
              style={{
                transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                opacity: menuOpen ? 1 : 0,
                transition: `color 0.2s, transform 0.4s ease ${i * 60}ms, opacity 0.4s ease ${i * 60}ms`,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact-us/"
            className="btn-primary mt-4"
            style={{
              transitionDelay: menuOpen ? `${NAV_LINKS.length * 60}ms` : "0ms",
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: menuOpen ? 1 : 0,
              transition: `transform 0.4s ease ${NAV_LINKS.length * 60}ms, opacity 0.4s ease ${NAV_LINKS.length * 60}ms`,
            }}
          >
            Hire Me
          </Link>
        </nav>
        <p className="absolute bottom-8 font-body text-sm text-[var(--color-muted)]">
          nitinmonga.in
        </p>
      </div>
    </>
  );
}
