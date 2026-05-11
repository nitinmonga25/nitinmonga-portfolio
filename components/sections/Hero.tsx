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
        <div
          ref={contentRef}
          className="flex-1 relative bg-[var(--color-surface)] flex flex-col overflow-hidden"
          style={{ borderRadius: "24px", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.3]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
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

              {/* Left: text */}
              <div className="flex flex-col max-w-[580px]">
                <div className="overflow-hidden" style={{ lineHeight: "0.88" }}>
                  <h1
                    className="h-nitin font-display font-bold text-[var(--color-ink)] block"
                    style={{ fontSize: "clamp(62px, 9.5vw, 148px)", letterSpacing: "-0.04em", lineHeight: "0.88" }}
                    aria-label="Nitin Monga"
                  >
                    Nitin
                  </h1>
                </div>
                <div className="overflow-hidden" style={{ lineHeight: "0.88", paddingBottom: "0.22em" }}>
                  <h1
                    className="h-monga font-display font-bold block text-[var(--color-accent)]"
                    style={{ fontSize: "clamp(62px, 9.5vw, 148px)", letterSpacing: "-0.04em", lineHeight: "0.88" }}
                    aria-hidden="true"
                  >
                    Monga
                  </h1>
                </div>
                <div
                  ref={lineRef}
                  className="h-px bg-[var(--color-accent)] mt-4 mb-5"
                  style={{ width: "clamp(100px, 14vw, 220px)" }}
                  aria-hidden="true"
                />
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
                <p
                  className="h-body font-body text-[var(--color-muted)] leading-relaxed mb-7 max-w-[380px]"
                  style={{ fontSize: "clamp(13px, 0.85vw, 15px)" }}
                >
                  {c.bio}
                </p>
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

              {/* Right: game panel */}
              <div
                className="hidden lg:block relative flex-shrink-0"
                style={{ width: "clamp(320px, 32vw, 480px)", height: "clamp(400px, 48vh, 580px)" }}
              >
                <div
                  className="h-3d-panel absolute"
                  style={{
                    left: "52px", right: 0, top: 0, bottom: "8px",
                    background: "#0F0F0F",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    overflow: "hidden",
                  }}
                >
                  <SimonGame />
                </div>

                {/* Floating tags */}
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

/* ─── Simon Says game ────────────────────────────────────────────────────── */

const COLORS = [
  { hex: "#FF3D00", glow: "255,61,0"   },
  { hex: "#06B6D4", glow: "6,182,212"  },
  { hex: "#10B981", glow: "16,185,129" },
  { hex: "#8B5CF6", glow: "139,92,246" },
];

type Phase = "idle" | "showing" | "input" | "over";

function SimonGame() {
  /* UI state — only for rendering */
  const [phase,   setPhase]   = useState<Phase>("idle");
  const [score,   setScore]   = useState(0);
  const [level,   setLevel]   = useState(0);
  const [hi,      setHi]      = useState(0);
  const [shake,   setShake]   = useState(false);
  const [flashOk, setFlashOk] = useState(false);
  const [newBest, setNewBest] = useState(false);

  /* Game refs — never stale in event handlers */
  const seqRef   = useRef<number[]>([]);
  const posRef   = useRef(0);
  const scoreRef = useRef(0);
  const hiRef    = useRef(0);
  const phaseRef = useRef<string>("idle");
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const btns     = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem("nm-simon-hs") || "0") || 0;
      hiRef.current = saved;
      setHi(saved);
    } catch {}
    // Auto-start after a short delay so user sees the buttons before they light up
    const autoId = setTimeout(() => startGame(), 1200);
    return () => {
      clearTimeout(autoId);
      timers.current.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addTimer(fn: () => void, ms: number) {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }
  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  /* Direct DOM — bypasses React batching for smooth animation */
  function lightUp(i: number) {
    const b = btns.current[i];
    if (!b) return;
    b.style.opacity   = "1";
    b.style.transform = "scale(1.08)";
    b.style.boxShadow = `0 0 40px rgba(${COLORS[i].glow},0.75), 0 0 80px rgba(${COLORS[i].glow},0.4)`;
  }
  function dimAll(forInput: boolean) {
    btns.current.forEach(b => {
      if (!b) return;
      b.style.opacity   = forInput ? "0.45" : "0.1";
      b.style.transform = "scale(1)";
      b.style.boxShadow = "none";
    });
  }
  function dimOne(i: number) {
    const b = btns.current[i];
    if (!b) return;
    b.style.opacity   = "0.45";
    b.style.transform = "scale(1)";
    b.style.boxShadow = "none";
  }

  function playSequence(seq: number[]) {
    clearTimers();
    phaseRef.current = "showing";
    setPhase("showing");
    dimAll(false);

    let t = 500;
    seq.forEach(colorIdx => {
      addTimer(() => lightUp(colorIdx), t);
      t += 700;
      addTimer(() => dimAll(false), t);
      t += 300;
    });
    addTimer(() => {
      phaseRef.current = "input";
      setPhase("input");
      dimAll(true);
    }, t + 250);
  }

  function startGame() {
    clearTimers();
    const first = [Math.floor(Math.random() * 4)];
    seqRef.current = first;
    posRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setLevel(1);
    setNewBest(false);
    playSequence(first);
  }

  function handlePress(i: number) {
    if (phaseRef.current !== "input") return;

    /* flash this button briefly */
    lightUp(i);
    addTimer(() => dimOne(i), 200);

    if (i !== seqRef.current[posRef.current]) {
      /* ── wrong ── */
      clearTimers();
      phaseRef.current = "wrong";
      setShake(true);
      addTimer(() => {
        setShake(false);
        dimAll(false);
        const hs = Math.max(scoreRef.current, hiRef.current);
        const isNew = hs > hiRef.current;
        if (isNew) {
          hiRef.current = hs;
          setHi(hs);
          try { localStorage.setItem("nm-simon-hs", String(hs)); } catch {}
        }
        setNewBest(isNew);
        phaseRef.current = "over";
        setPhase("over");
      }, 650);
      return;
    }

    posRef.current++;

    if (posRef.current >= seqRef.current.length) {
      /* ── sequence complete ── */
      phaseRef.current = "wait";
      scoreRef.current++;
      setScore(scoreRef.current);
      setFlashOk(true);
      addTimer(() => setFlashOk(false), 480);
      addTimer(() => {
        const next = [...seqRef.current, Math.floor(Math.random() * 4)];
        seqRef.current = next;
        posRef.current = 0;
        setLevel(next.length);
        playSequence(next);
      }, 900);
    }
  }

  const S: React.CSSProperties = { fontFamily: "var(--font-body)" };
  const D: React.CSSProperties = { fontFamily: "var(--font-display)" };

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: "#0F0F0F" }}>

      {/* Success flash overlay */}
      {flashOk && (
        <div
          className="absolute inset-0 pointer-events-none z-50"
          style={{ background: "rgba(16,185,129,0.14)", borderRadius: "inherit" }}
          aria-hidden="true"
        />
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 20px 8px" }}>
        <div>
          <p style={{ ...S, fontSize: "10px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#FF3D00" }}>
            Simon Says
          </p>
          {phase !== "idle" && (
            <p style={{ ...S, fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "3px" }}>
              Level {level}
            </p>
          )}
        </div>
        {phase !== "idle" && (
          <div style={{ textAlign: "right" }}>
            <p style={{ ...D, fontSize: "38px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
              {String(score).padStart(2, "0")}
            </p>
            <p style={{ ...S, fontSize: "10px", color: "rgba(255,255,255,0.22)", marginTop: "2px" }}>
              Best: {hi}
            </p>
          </div>
        )}
      </div>

      {/* ── Button grid ── */}
      <div
        className={shake ? "simon-shake" : ""}
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", width: "100%", maxWidth: "260px" }}>
          {COLORS.map((c, i) => (
            <button
              key={i}
              ref={el => { btns.current[i] = el; }}
              onClick={() => handlePress(i)}
              style={{
                aspectRatio: "1",
                borderRadius: "14px",
                background: c.hex,
                opacity: 0.1,
                border: "none",
                outline: "none",
                cursor: "pointer",
                transition: "opacity 0.08s ease, transform 0.08s ease, box-shadow 0.08s ease",
              }}
              aria-label={`Button ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom UI ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "12px 20px 22px" }}>

        {/* Level dots */}
        {phase !== "idle" && (
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", maxWidth: "220px" }}>
            {Array.from({ length: Math.max(level, 10) }).map((_, i) => (
              <div key={i} style={{
                width: i < level ? "7px" : "5px",
                height: i < level ? "7px" : "5px",
                borderRadius: "50%",
                background: i < level ? "#FF3D00" : "rgba(255,255,255,0.1)",
                transition: "all 0.3s",
                flexShrink: 0,
              }} />
            ))}
          </div>
        )}

        {phase === "idle" && (
          <p style={{ ...S, fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            Starting…
          </p>
        )}

        {phase === "showing" && (
          <p style={{ ...S, fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Watch carefully…</p>
        )}

        {phase === "input" && (
          <p style={{ ...S, fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Your turn!</p>
        )}

        {phase === "over" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center" }}>
            <div>
              <p style={{ ...D, fontSize: "52px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{score}</p>
              <p style={{ ...S, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px", color: newBest ? "#10B981" : "rgba(255,255,255,0.3)" }}>
                {newBest ? "🎉 New Best!" : `Best: ${hi}`}
              </p>
            </div>
            <button
              onClick={startGame}
              style={{ ...S, background: "#FF3D00", color: "#fff", border: "none", borderRadius: "100px", padding: "11px 32px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,61,0,0.45)" }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
