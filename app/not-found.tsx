"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ── Scramble hook ────────────────────────────────────────────────────────── */
const CHARS = "!@#$%&X?4▲0◆█▓░";

function useScramble(target: string, running: boolean) {
  const [text, setText] = useState(target);
  const step  = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!running) { setText(target); return; }
    step.current = 0;
    const STEPS    = 12;   // total steps
    const INTERVAL = 80;   // ms between steps — 80 × 12 = ~1 second

    timer.current = setInterval(() => {
      step.current++;
      const progress = step.current / STEPS;
      setText(
        target
          .split("")
          .map((ch, i) =>
            i < Math.floor(progress * target.length)
              ? ch
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join("")
      );
      if (step.current >= STEPS) {
        clearInterval(timer.current);
        setText(target);
      }
    }, INTERVAL);

    return () => clearInterval(timer.current);
  }, [target, running]);

  return text;
}

/* ── Magnetic digit ───────────────────────────────────────────────────────── */
function MagneticDigit({ char }: { char: string }) {
  const ref    = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const scrambled = useScramble(char, hovered);
  const anim   = useRef<ReturnType<typeof requestAnimationFrame>>();

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect   = el.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = e.clientX - cx;
    const dy     = e.clientY - cy;
    const dist   = Math.sqrt(dx * dx + dy * dy);
    const radius = 140;

    if (dist < radius) {
      const force = (1 - dist / radius) * 60;
      const tx    = -(dx / dist) * force;
      const ty    = -(dy / dist) * force;
      if (anim.current) cancelAnimationFrame(anim.current);
      setPos({ x: tx, y: ty });
    } else {
      // spring back
      if (anim.current) cancelAnimationFrame(anim.current);
      setPos((p) => {
        if (Math.abs(p.x) < 0.5 && Math.abs(p.y) < 0.5) return { x: 0, y: 0 };
        return { x: p.x * 0.8, y: p.y * 0.8 };
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  return (
    <span
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:    "inline-block",
        transform:  `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        cursor:     "default",
        userSelect: "none",
        color:      hovered ? "var(--color-accent)" : "var(--color-ink)",
      }}
    >
      {scrambled}
    </span>
  );
}

/* ── Floating noise dots ──────────────────────────────────────────────────── */
function NoiseDots() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => (
        <div
          key={i}
          style={{
            position:        "absolute",
            width:           `${6 + (i % 5) * 4}px`,
            height:          `${6 + (i % 5) * 4}px`,
            borderRadius:    "50%",
            background:      i % 3 === 0 ? "var(--color-accent)" : "var(--color-border)",
            opacity:         0.25 + (i % 4) * 0.1,
            left:            `${(i * 37 + 7) % 95}%`,
            top:             `${(i * 53 + 11) % 90}%`,
            animation:       `float-dot ${3 + (i % 4)}s ease-in-out ${(i * 0.4) % 3}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Glitch line strip ────────────────────────────────────────────────────── */
function GlitchStrip() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setOn(true);
      setTimeout(() => setOn(false), 120);
    }, 2800 + Math.random() * 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position:   "absolute",
        inset:      0,
        overflow:   "hidden",
        pointerEvents: "none",
        zIndex:     1,
      }}
      aria-hidden
    >
      {on && (
        <>
          <div style={{ position: "absolute", top: `${20 + Math.random() * 40}%`, left: 0, right: 0, height: "2px", background: "var(--color-accent)", opacity: 0.35 }} />
          <div style={{ position: "absolute", top: `${30 + Math.random() * 30}%`, left: `${Math.random() * 20}%`, right: `${Math.random() * 20}%`, height: "1px", background: "var(--color-ink)", opacity: 0.15 }} />
        </>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function NotFound() {
  const DIGITS = ["4", "0", "4"];

  return (
    <>
      <style>{`
        @keyframes float-dot {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-18px) rotate(180deg); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .not-found-anim { animation: slide-up 0.6s ease both; }
        .not-found-anim-d1 { animation-delay: 0.05s; }
        .not-found-anim-d2 { animation-delay: 0.15s; }
        .not-found-anim-d3 { animation-delay: 0.25s; }
        .not-found-anim-d4 { animation-delay: 0.35s; }
      `}</style>

      <div
        style={{
          position:        "relative",
          minHeight:       "100svh",
          background:      "var(--color-bg)",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
          overflow:        "hidden",
          padding:         "2rem",
        }}
      >
        <NoiseDots />
        <GlitchStrip />

        {/* ── Giant 404 ─────────────────────────────────────────────── */}
        <div
          className="not-found-anim not-found-anim-d1"
          style={{
            position:   "relative",
            zIndex:     2,
            fontSize:   "clamp(120px, 22vw, 280px)",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            display:    "flex",
            gap:        "0.04em",
          }}
          aria-label="404"
        >
          {DIGITS.map((d, i) => (
            <MagneticDigit key={i} char={d} />
          ))}
        </div>

        {/* ── Accent rule ───────────────────────────────────────────── */}
        <div
          className="not-found-anim not-found-anim-d2"
          style={{
            zIndex:    2,
            marginTop: "2rem",
            display:   "flex",
            alignItems: "center",
            gap:       "12px",
          }}
        >
          <div style={{ width: "32px", height: "2px", background: "var(--color-accent)" }} />
          <span
            style={{
              fontFamily:    "var(--font-body)",
              fontSize:      "11px",
              fontWeight:    700,
              letterSpacing: "3.5px",
              textTransform: "uppercase",
              color:         "var(--color-accent)",
            }}
          >
            Page Not Found
          </span>
          <div style={{ width: "32px", height: "2px", background: "var(--color-accent)" }} />
        </div>

        {/* ── Message ───────────────────────────────────────────────── */}
        <p
          className="not-found-anim not-found-anim-d3"
          style={{
            zIndex:     2,
            marginTop:  "1.25rem",
            fontFamily: "var(--font-body)",
            fontSize:   "clamp(15px, 2vw, 18px)",
            color:      "var(--color-muted)",
            textAlign:  "center",
            maxWidth:   "420px",
            lineHeight: 1.65,
          }}
        >
          Looks like this page slipped through the grid.
          <br />
          Even the best designs have a missing piece.
        </p>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <div
          className="not-found-anim not-found-anim-d4"
          style={{
            zIndex:     2,
            marginTop:  "2.5rem",
            display:    "flex",
            gap:        "12px",
            flexWrap:   "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "8px",
              padding:       "12px 28px",
              background:    "var(--color-accent)",
              color:         "#fff",
              fontFamily:    "var(--font-body)",
              fontSize:      "14px",
              fontWeight:    700,
              borderRadius:  "100px",
              textDecoration: "none",
              boxShadow:     "0 6px 20px rgba(255,61,0,0.35)",
              transition:    "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 28px rgba(255,61,0,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(255,61,0,0.35)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M6 2L1 7l5 5M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>

          <Link
            href="/work/"
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "8px",
              padding:       "12px 28px",
              background:    "transparent",
              color:         "var(--color-ink)",
              fontFamily:    "var(--font-body)",
              fontSize:      "14px",
              fontWeight:    600,
              borderRadius:  "100px",
              textDecoration: "none",
              border:        "1.5px solid var(--color-border)",
              transition:    "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-accent)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-border)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-ink)";
            }}
          >
            See My Work
          </Link>
        </div>

        {/* ── Bottom signature ──────────────────────────────────────── */}
        <p
          style={{
            position:   "absolute",
            bottom:     "2rem",
            zIndex:     2,
            fontFamily: "var(--font-body)",
            fontSize:   "12px",
            color:      "var(--color-border)",
            letterSpacing: "1px",
          }}
          aria-hidden
        >
          nitinmonga.in
        </p>
      </div>
    </>
  );
}
