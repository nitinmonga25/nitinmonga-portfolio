"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export interface HeroContent {
  bio: string;
  roles: string[];
}

const DEFAULT: HeroContent = {
  bio: "10+ years creating websites, brands, 3D campaigns and digital platforms. Based in Punjab, India.",
  roles: ["Graphic Designer", "3D Artist", "Full-Stack Developer", "Creative Director"],
};

export function Hero({ content }: { content?: HeroContent }) {
  const c = { ...DEFAULT, ...content };
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const [roleIdx,   setRoleIdx]   = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isTyping,  setIsTyping]  = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power4.out" } });
      tl.from(".h-topbar",   { y: -16, duration: 0.5 })
        .from(".h-nitin",    { y: "105%", duration: 0.8 }, "-=0.2")
        .from(".h-monga",    { y: "105%", duration: 0.8 }, "-=0.6")
        .from(lineRef.current, { scaleX: 0, duration: 0.7, ease: "power3.inOut", transformOrigin: "left" }, "-=0.3")
        .from(".h-sub",      { y: 16, duration: 0.5 }, "-=0.3")
        .from(".h-body",     { y: 16, duration: 0.5 }, "-=0.4")
        .from(".h-ctas",     { y: 16, duration: 0.5 }, "-=0.4")
        .from(".h-3d-panel", { x: 40, duration: 0.9, ease: "power3.out" }, "-=0.7")
        .from(".h-tag",      { scale: 0.82, duration: 0.45, stagger: 0.12, ease: "back.out(1.4)" }, "-=0.5");
    }, contentRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const full = c.roles[roleIdx];
    if (isTyping) {
      if (displayed.length < full.length) {
        const id = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 55);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setIsTyping(false), 2400);
      return () => clearTimeout(id);
    } else {
      if (displayed.length > 0) {
        const id = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        return () => clearTimeout(id);
      }
      setRoleIdx((r) => (r + 1) % c.roles.length);
      setIsTyping(true);
    }
  }, [displayed, isTyping, roleIdx, c.roles]);

  return (
    <section
      data-hero
      className="min-h-screen bg-[var(--color-bg)] flex flex-col pt-[72px] pb-5"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex-1 flex flex-col w-full">
        {/* ── White boxed card ──────────────────────────────────────────── */}
        <div
          ref={contentRef}
          className="flex-1 relative bg-[var(--color-surface)] flex flex-col overflow-hidden"
          style={{ borderRadius: "24px", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          {/* Subtle dot grid inside card */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.3]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />

          {/* Top status bar */}
          <div className="relative z-10 h-topbar flex items-center justify-between px-8 lg:px-14 pt-7 pb-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse-red" aria-hidden="true" />
              <span className="font-body text-[11px] font-semibold uppercase tracking-[2.5px] text-[var(--color-ink)]">
                Available for Hire
              </span>
            </div>
            <span className="section-label">{"// Portfolio 2025"}</span>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex-1 flex items-center px-8 lg:px-14 py-4">
            <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-8">

              {/* ── Left: Typography + CTAs ─────────────────────────────── */}
              <div className="flex flex-col max-w-[580px]">

                {/* Nitin — filled black */}
                <div className="overflow-hidden" style={{ lineHeight: "0.88" }}>
                  <h1
                    className="h-nitin font-display font-bold text-[var(--color-ink)] block"
                    style={{ fontSize: "clamp(62px, 9.5vw, 148px)", letterSpacing: "-0.04em", lineHeight: "0.88" }}
                    aria-label="Nitin Monga"
                  >
                    Nitin
                  </h1>
                </div>

                {/* Monga — filled accent, with paddingBottom so "g" descender is never clipped */}
                <div className="overflow-hidden" style={{ lineHeight: "0.88", paddingBottom: "0.22em" }}>
                  <h1
                    className="h-monga font-display font-bold block text-[var(--color-accent)]"
                    style={{ fontSize: "clamp(62px, 9.5vw, 148px)", letterSpacing: "-0.04em", lineHeight: "0.88" }}
                    aria-hidden="true"
                  >
                    Monga
                  </h1>
                </div>

                {/* Red rule */}
                <div
                  ref={lineRef}
                  className="h-px bg-[var(--color-accent)] mt-4 mb-5"
                  style={{ width: "clamp(100px, 14vw, 220px)" }}
                  aria-hidden="true"
                />

                {/* Typewriter */}
                <div className="h-sub flex items-center gap-2 mb-4" style={{ minHeight: "26px" }}>
                  <span
                    className="font-body font-medium text-[var(--color-ink)]"
                    style={{ fontSize: "clamp(13px, 1vw, 17px)" }}
                    aria-live="polite"
                  >
                    {displayed}
                  </span>
                  <span
                    className="inline-block w-[2px] h-5 bg-[var(--color-accent)] flex-shrink-0"
                    style={{ animation: "blink 1.1s step-end infinite" }}
                    aria-hidden="true"
                  />
                </div>

                {/* Body */}
                <p
                  className="h-body font-body text-[var(--color-muted)] leading-relaxed mb-7 max-w-[380px]"
                  style={{ fontSize: "clamp(13px, 0.85vw, 15px)" }}
                >
                  {c.bio}
                </p>

                {/* CTAs */}
                <div className="h-ctas flex flex-wrap items-center gap-3">
                  <Link href="/work/" className="btn-primary group">
                    View My Work
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <a href="/nitin-monga-resume.pdf" className="btn-secondary" download>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path d="M6.5 1.5v7M3.5 5.5l3 3.5 3-3.5M1.5 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Resume
                  </a>
                </div>
              </div>

              {/* ── Right: CSS 3D scene + floating tags ───────────────────── */}
              <div
                className="hidden lg:block relative flex-shrink-0"
                style={{ width: "clamp(320px, 32vw, 480px)", height: "clamp(400px, 48vh, 580px)" }}
              >
                {/* 3D panel */}
                <div
                  className="h-3d-panel absolute"
                  style={{
                    left: "52px", right: 0, top: 0, bottom: "44px",
                    background: "var(--color-accent-light)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,61,0,0.12)",
                    overflow: "hidden",
                  }}
                >
                  <HeroVisual />
                </div>

                {/* Tag: Web Design */}
                <div
                  className="h-tag absolute flex items-center gap-2.5 animate-float"
                  style={{ left: 0, top: "17%", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "var(--shadow-card)", padding: "9px 13px", zIndex: 2 }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-accent-light)" }}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <rect x="1" y="2" width="11" height="9" rx="1.5" stroke="var(--color-accent)" strokeWidth="1.2"/>
                      <path d="M1 5.5h11" stroke="var(--color-accent)" strokeWidth="1.2"/>
                      <path d="M3.5 4h.5M5 4h.5" stroke="var(--color-accent)" strokeWidth="1.1" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-[11px] font-semibold text-[var(--color-ink)] leading-none mb-0.5">Web Design</p>
                    <p className="font-body text-[9.5px] text-[var(--color-muted)] leading-none">400+ projects</p>
                  </div>
                </div>

                {/* Tag: 3D Art */}
                <div
                  className="h-tag absolute flex items-center gap-2.5 animate-float-rev"
                  style={{ right: "-10px", top: "37%", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "var(--shadow-card)", padding: "9px 13px", zIndex: 2 }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-accent-light)" }}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path d="M6.5 1.5L12 4.5v4L6.5 11.5 1 8.5v-4L6.5 1.5z" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinejoin="round"/>
                      <path d="M6.5 1.5v10M1 4.5l5.5 3.5 5.5-3.5" stroke="var(--color-accent)" strokeWidth="1" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-[11px] font-semibold text-[var(--color-ink)] leading-none mb-0.5">3D Art</p>
                    <p className="font-body text-[9.5px] text-[var(--color-muted)] leading-none">40+ CGI ads</p>
                  </div>
                </div>

                {/* Tag: Full-Stack */}
                <div
                  className="h-tag absolute flex items-center gap-2.5 animate-float"
                  style={{ left: 0, bottom: "32%", animationDelay: "1.1s", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "var(--shadow-card)", padding: "9px 13px", zIndex: 2 }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-accent-light)" }}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path d="M4.5 3.5L2 6.5l2.5 3M8.5 3.5L11 6.5l-2.5 3M6 2l1 9" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-[11px] font-semibold text-[var(--color-ink)] leading-none mb-0.5">Full-Stack Dev</p>
                    <p className="font-body text-[9.5px] text-[var(--color-muted)] leading-none">Next.js · React</p>
                  </div>
                </div>

              </div>

            </div>
          </div>


        </div>
      </div>
    </section>
  );
}

/* ─── Creative CSS 3D scene (mouse-draggable cube) ───────────────────────── */
function HeroVisual() {
  const cubeRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    rotX: -18, rotY: 28,
    velX: 0,   velY: 0.35,
    dragging: false,
    lastX: 0,  lastY: 0,
    rafId: 0,
  });

  useEffect(() => {
    const s = state.current;

    const tick = () => {
      if (!s.dragging) {
        s.velY += (0.32 - s.velY) * 0.018;
        s.velX += (0    - s.velX) * 0.03;
      } else {
        s.velX *= 0.85;
        s.velY *= 0.85;
      }
      s.rotX = Math.max(-70, Math.min(70, s.rotX + s.velX));
      s.rotY += s.velY;
      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${s.rotX}deg) rotateY(${s.rotY}deg)`;
      }
      s.rafId = requestAnimationFrame(tick);
    };
    s.rafId = requestAnimationFrame(tick);

    const onMouseMove = (e: MouseEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.velY = dx * 0.45;
      s.velX = -dy * 0.45;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
    };
    const onMouseUp = () => {
      s.dragging = false;
      if (containerRef.current) containerRef.current.style.cursor = "grab";
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!s.dragging) return;
      const t = e.touches[0];
      const dx = t.clientX - s.lastX;
      const dy = t.clientY - s.lastY;
      s.velY = dx * 0.45;
      s.velX = -dy * 0.45;
      s.lastX = t.clientX;
      s.lastY = t.clientY;
    };
    const onTouchEnd = () => { s.dragging = false; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend",  onTouchEnd);

    return () => {
      cancelAnimationFrame(s.rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  onTouchEnd);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.velX  = 0;
    s.velY  = 0;
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
    e.preventDefault();
  };

  return (
    <div className="w-full h-full relative overflow-hidden" aria-hidden="true">
      {/* Accent dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,61,0,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* ── Draggable CSS 3D cube ── */}
      <div
        ref={containerRef}
        className="absolute select-none"
        style={{ top: "46%", left: "52%", transform: "translate(-50%, -50%)", perspective: "520px", cursor: "grab" }}
        onPointerDown={onPointerDown}
      >
        <div
          ref={cubeRef}
          style={{
            width: "130px", height: "130px",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(-18deg) rotateY(28deg)`,
            willChange: "transform",
          }}
        >
          {/* Front */}
          <div style={{ position: "absolute", inset: 0, background: "#111111", transform: "translateZ(65px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "30px", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>NM</span>
          </div>
          {/* Back */}
          <div style={{ position: "absolute", inset: 0, background: "#111111", transform: "rotateY(180deg) translateZ(65px)" }} />
          {/* Top — accent */}
          <div style={{ position: "absolute", inset: 0, background: "#FF3D00", transform: "rotateX(90deg) translateZ(65px)" }} />
          {/* Bottom */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,61,0,0.35)", transform: "rotateX(-90deg) translateZ(65px)" }} />
          {/* Left */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.72)", transform: "rotateY(-90deg) translateZ(65px)" }} />
          {/* Right */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.50)", transform: "rotateY(90deg) translateZ(65px)" }} />
        </div>

        {/* Hint label on first hover */}
        <div
          className="absolute pointer-events-none"
          style={{ bottom: "-28px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}
        >
          <span style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,61,0,0.55)", fontFamily: "var(--font-body)" }}>
            drag to spin
          </span>
        </div>
      </div>

      {/* Orbit ring 1 */}
      <div
        className="absolute rounded-full"
        style={{
          top: "46%", left: "52%",
          width: "210px", height: "210px",
          marginTop: "-105px", marginLeft: "-105px",
          border: "1.5px dashed rgba(255,61,0,0.4)",
          animation: "spinBadge 16s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Orbit ring 2 — tilted */}
      <div
        className="absolute rounded-full"
        style={{
          top: "46%", left: "52%",
          width: "160px", height: "160px",
          marginTop: "-80px", marginLeft: "-80px",
          border: "1px dashed rgba(255,61,0,0.25)",
          transform: "rotateX(65deg)",
          animation: "spinBadge 11s linear infinite reverse",
          pointerEvents: "none",
        }}
      />

      {/* Small floating cubes */}
      <MiniCube size={34} color="#FF3D00" top="14%" left="13%" duration="8s" delay="0s"   floatClass="animate-float" />
      <MiniCube size={22} color="#111111" bottom="16%" right="11%" duration="6s" delay="0.5s" floatClass="animate-float-rev" />
      <MiniCube size={14} color="#FF3D00" top="24%" right="16%" duration="9s" delay="1.2s"  floatClass="animate-float" />

      {/* Accent dots */}
      <div className="absolute w-2 h-2 rounded-full bg-[#FF3D00] opacity-60 animate-float" style={{ bottom: "32%", left: "18%", animationDelay: "0.7s" }} />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-[#111111] opacity-30 animate-float-rev" style={{ top: "38%", right: "22%", animationDelay: "1.8s" }} />

      {/* Label */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
        <span className="font-body text-[10px] uppercase tracking-[2px] text-[var(--color-accent-dark)]">
          Creative 3D
        </span>
      </div>
    </div>
  );
}

/* Mini rotating cube helper */
function MiniCube({
  size, color, duration, delay, floatClass,
  top, left, right, bottom,
}: {
  size: number; color: string;
  duration: string; delay: string; floatClass: string;
  top?: string; left?: string; right?: string; bottom?: string;
}) {
  const half = size / 2;
  const pos: React.CSSProperties = {};
  if (top)    pos.top    = top;
  if (left)   pos.left   = left;
  if (right)  pos.right  = right;
  if (bottom) pos.bottom = bottom;

  return (
    <div className={`absolute ${floatClass}`} style={{ perspective: "180px", animationDelay: delay, ...pos }}>
      <div
        style={{
          width: `${size}px`, height: `${size}px`,
          position: "relative",
          transformStyle: "preserve-3d",
          animation: `rotateCube ${duration} linear infinite`,
          animationDelay: delay,
        }}
      >
        {[
          { t: `translateZ(${half}px)`,                  bg: color,   op: 1   },
          { t: `rotateY(180deg) translateZ(${half}px)`,  bg: color,   op: 0.7 },
          { t: `rotateX(90deg) translateZ(${half}px)`,   bg: color,   op: 0.9 },
          { t: `rotateX(-90deg) translateZ(${half}px)`,  bg: color,   op: 0.35 },
          { t: `rotateY(-90deg) translateZ(${half}px)`,  bg: color,   op: 0.8 },
          { t: `rotateY(90deg) translateZ(${half}px)`,   bg: color,   op: 0.55 },
        ].map(({ t, bg, op }, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, background: bg, opacity: op, transform: t }} />
        ))}
      </div>
    </div>
  );
}
