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
            <span className="section-label">{"// Portfolio 2026"}</span>
          </div>

          {/* Floating skill badges — right-side blank spaces only, hidden on mobile */}
          {/* Badge 1: top-right corner, above the game panel */}
          <div
            className="h-tag hidden xl:flex absolute items-center gap-2.5 animate-float pointer-events-none"
            style={{ right: "3%", top: "12%", animationDelay: "0s", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "var(--shadow-card)", padding: "9px 13px", zIndex: 1 }}
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

          {/* Badge 2: center-bottom, right of the CTAs */}
          <div
            className="h-tag hidden xl:flex absolute items-center gap-2.5 animate-float-rev pointer-events-none"
            style={{ left: "42%", bottom: "9%", animationDelay: "0.8s", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "var(--shadow-card)", padding: "9px 13px", zIndex: 1 }}
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

          {/* Badge 3: bottom-right corner, below the game panel */}
          <div
            className="h-tag hidden xl:flex absolute items-center gap-2.5 animate-float pointer-events-none"
            style={{ right: "3%", bottom: "10%", animationDelay: "1.5s", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "10px", boxShadow: "var(--shadow-card)", padding: "9px 13px", zIndex: 1 }}
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
                <div className="overflow-hidden" style={{ lineHeight: "0.88", paddingBottom: "0.35em" }}>
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
                  <Link href="/blog/" className="btn-secondary">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path d="M1.5 2.5h10M1.5 5.5h7M1.5 8.5h8M1.5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    Blog
                  </Link>
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
                    background: "transparent",
                    borderRadius: "16px",
                    border: "1px solid rgba(0,0,0,0.07)",
                    overflow: "hidden",
                  }}
                >
                  <PinballGame />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pinball game ───────────────────────────────────────────────────────── */

type PBPhase = "idle" | "playing" | "relaunching" | "over";

interface PBBumper { x: number; y: number; r: number; hex: string; glow: string; hit: number }

const PB_BUMPERS_CFG = [
  { rx: 0.50, ry: 0.18, r: 20, hex: "#FF3D00", glow: "255,61,0"   },
  { rx: 0.22, ry: 0.38, r: 18, hex: "#06B6D4", glow: "6,182,212"  },
  { rx: 0.78, ry: 0.38, r: 18, hex: "#10B981", glow: "16,185,129" },
];

function fillRR(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function PinballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const rafRef    = useRef(0);
  const mxRef     = useRef(0);

  const G = useRef<{
    phase:   PBPhase;
    ball:    { x: number; y: number; vx: number; vy: number; trail: { x: number; y: number }[]; sx: number; sy: number };
    paddle:  { x: number; w: number; h: number };
    bumpers: PBBumper[];
    ripples: { x: number; y: number; r: number; maxR: number; a: number; color: string }[];
    score: number; lives: number; hi: number; newBest: boolean;
    W: number; H: number;
  }>({
    phase: "idle",
    ball:    { x: 0, y: 0, vx: 0, vy: 0, trail: [], sx: 1, sy: 1 },
    paddle:  { x: 200, w: 88, h: 10 },
    bumpers: [],
    ripples: [],
    score: 0, lives: 3, hi: 0, newBest: false,
    W: 0, H: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap   = wrapRef.current!;
    const ctx    = canvas.getContext("2d")!;

    function resize() {
      G.current.W = wrap.clientWidth;
      G.current.H = wrap.clientHeight;
      canvas.width  = G.current.W;
      canvas.height = G.current.H;
      mxRef.current = G.current.W / 2;
      G.current.paddle.x = G.current.W / 2;
      buildBumpers();
    }

    function buildBumpers() {
      const { W, H } = G.current;
      const TOP = 80; // header reserved height
      const gameH = H - TOP;
      G.current.bumpers = PB_BUMPERS_CFG.map(b => ({
        x: W * b.rx,
        y: TOP + gameH * b.ry,
        r: b.r, hex: b.hex, glow: b.glow, hit: 0,
      }));
    }

    function launchBall() {
      const g = G.current;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.7;
      const speed = 5 + Math.random() * 1.2;
      g.ball = {
        x: g.paddle.x + (Math.random() - 0.5) * 20,
        y: g.H - 70,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        trail: [],
        sx: 1, sy: 1,
      };
      g.phase = "playing";
    }

    function startGame() {
      const g = G.current;
      try { g.hi = parseInt(localStorage.getItem("nm-pinball-hs") || "0") || 0; } catch {}
      g.score   = 0;
      g.lives   = 3;
      g.newBest = false;
      g.paddle.x = g.W / 2;
      mxRef.current = g.W / 2;
      launchBall();
    }

    const GRAVITY   = 0.09;
    const SPEED_MAX = 8;
    const BALL_R    = 11;
    const PAD_Y_OFF = 54; // paddle Y from bottom

    function update() {
      const g = G.current;
      if (g.phase !== "playing") return;

      const b  = g.ball;
      const pd = g.paddle;
      const PY = g.H - PAD_Y_OFF;

      // Smooth paddle to mouse
      const clampedX = Math.max(pd.w / 2, Math.min(g.W - pd.w / 2, mxRef.current));
      pd.x += (clampedX - pd.x) * 0.22;

      // Trail
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > 12) b.trail.shift();

      // Gravity
      b.vy += GRAVITY;

      // Speed cap
      const spd = Math.hypot(b.vx, b.vy);
      if (spd > SPEED_MAX) { b.vx = b.vx / spd * SPEED_MAX; b.vy = b.vy / spd * SPEED_MAX; }

      b.x += b.vx;
      b.y += b.vy;

      // Wall bounces — squash perpendicular to impact surface
      if (b.x - BALL_R < 0)   { b.x = BALL_R;       b.vx =  Math.abs(b.vx); b.sx = 0.55; b.sy = 1.45; g.ripples.push({ x: BALL_R, y: b.y, r: BALL_R, maxR: BALL_R * 3.5, a: 0.6, color: "#FF3D00" }); }
      if (b.x + BALL_R > g.W) { b.x = g.W - BALL_R; b.vx = -Math.abs(b.vx); b.sx = 0.55; b.sy = 1.45; g.ripples.push({ x: g.W - BALL_R, y: b.y, r: BALL_R, maxR: BALL_R * 3.5, a: 0.6, color: "#FF3D00" }); }
      if (b.y - BALL_R < 0)   { b.y = BALL_R;        b.vy =  Math.abs(b.vy); b.sx = 1.45; b.sy = 0.55; g.ripples.push({ x: b.x, y: BALL_R, r: BALL_R, maxR: BALL_R * 3.5, a: 0.6, color: "#FF3D00" }); }

      // Paddle collision
      if (
        b.vy > 0 &&
        b.y + BALL_R >= PY - pd.h / 2 - 1 &&
        b.y + BALL_R <= PY + pd.h / 2 + 6 &&
        b.x >= pd.x - pd.w / 2 - BALL_R &&
        b.x <= pd.x + pd.w / 2 + BALL_R
      ) {
        const hit = (b.x - pd.x) / (pd.w / 2);   // -1 to 1
        b.vx = hit * 4.5;
        b.vy = -Math.max(5, Math.abs(b.vy));
        b.y  = PY - pd.h / 2 - BALL_R;
        b.sx = 1.6; b.sy = 0.5;
        g.ripples.push({ x: b.x, y: PY, r: BALL_R, maxR: BALL_R * 4, a: 0.7, color: "#FF3D00" });
      }

      // Bumper collisions
      for (const bmp of g.bumpers) {
        const dx = b.x - bmp.x, dy = b.y - bmp.y;
        const dist = Math.hypot(dx, dy);
        if (dist < BALL_R + bmp.r && dist > 0) {
          const nx = dx / dist, ny = dy / dist;
          const dot = b.vx * nx + b.vy * ny;
          b.vx = b.vx - 2 * dot * nx;
          b.vy = b.vy - 2 * dot * ny;
          const ns = Math.min(Math.hypot(b.vx, b.vy) * 1.06 + 0.4, SPEED_MAX);
          const na = Math.atan2(b.vy, b.vx);
          b.vx = Math.cos(na) * ns;
          b.vy = Math.sin(na) * ns;
          b.x  = bmp.x + nx * (BALL_R + bmp.r + 1);
          b.y  = bmp.y + ny * (BALL_R + bmp.r + 1);
          b.sx = 0.72; b.sy = 0.72;
          bmp.hit = 22;
          g.score++;
          g.ripples.push({ x: bmp.x, y: bmp.y, r: bmp.r, maxR: bmp.r * 2.8, a: 0.85, color: bmp.hex });
        }
      }
      for (const bmp of g.bumpers) if (bmp.hit > 0) bmp.hit--;

      // Squash decay — spring back to round
      b.sx += (1 - b.sx) * 0.18;
      b.sy += (1 - b.sy) * 0.18;

      // Ripple decay
      g.ripples = g.ripples
        .map(rp => ({ ...rp, r: rp.r + 1.8, a: rp.a * 0.88 }))
        .filter(rp => rp.a > 0.03);

      // Ball lost
      if (b.y > g.H + BALL_R * 2) {
        g.lives--;
        b.trail = [];
        if (g.lives <= 0) {
          const isNew = g.score > g.hi;
          if (isNew) {
            g.hi = g.score;
            try { localStorage.setItem("nm-pinball-hs", String(g.score)); } catch {}
            g.newBest = true;
          }
          g.phase = "over";
        } else {
          g.phase = "relaunching";
          setTimeout(() => { if (G.current.phase === "relaunching") launchBall(); }, 900);
        }
      }
    }

    function draw() {
      const g  = G.current;
      const b  = g.ball;
      const pd = g.paddle;
      const W  = g.W, H = g.H;
      const PY = H - PAD_Y_OFF;

      // Transparent — hero card background shows through
      ctx.clearRect(0, 0, W, H);

      // ── Side kicker guides ──
      ctx.strokeStyle = "rgba(255,61,0,0.18)";
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, H - 10);
      ctx.lineTo(W * 0.18, PY - 24);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W, H - 10);
      ctx.lineTo(W * 0.82, PY - 24);
      ctx.stroke();

      // ── Bumpers ──
      for (const bmp of g.bumpers) {
        const t = bmp.hit / 22;

        if (t > 0) {
          const gr = ctx.createRadialGradient(bmp.x, bmp.y, 0, bmp.x, bmp.y, bmp.r * 3);
          gr.addColorStop(0, `rgba(${bmp.glow},${t * 0.4})`);
          gr.addColorStop(1, "transparent");
          ctx.fillStyle = gr;
          ctx.beginPath(); ctx.arc(bmp.x, bmp.y, bmp.r * 3, 0, Math.PI * 2); ctx.fill();
        }

        // Outer ring
        ctx.globalAlpha = 0.5 + t * 0.5;
        ctx.strokeStyle = bmp.hex;
        ctx.lineWidth   = 2;
        ctx.beginPath(); ctx.arc(bmp.x, bmp.y, bmp.r, 0, Math.PI * 2); ctx.stroke();

        // Inner fill flash on hit
        if (t > 0) {
          ctx.fillStyle   = bmp.hex;
          ctx.globalAlpha = t * 0.35;
          ctx.beginPath(); ctx.arc(bmp.x, bmp.y, bmp.r - 2, 0, Math.PI * 2); ctx.fill();
        }

        // Center dot
        ctx.globalAlpha = 1;
        ctx.fillStyle   = bmp.hex;
        ctx.beginPath(); ctx.arc(bmp.x, bmp.y, 4.5, 0, Math.PI * 2); ctx.fill();
      }

      // ── Ripples ──
      for (const rp of g.ripples) {
        ctx.globalAlpha = rp.a;
        ctx.strokeStyle = rp.color;
        ctx.lineWidth   = 1.5;
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // ── Paddle ──
      if (g.phase === "playing" || g.phase === "relaunching") {
        const pw = pd.w, ph = pd.h;
        const px = pd.x - pw / 2, py = PY - ph / 2;
        ctx.shadowColor = "rgba(255,61,0,0.55)";
        ctx.shadowBlur  = 12;
        const pg = ctx.createLinearGradient(px, 0, px + pw, 0);
        pg.addColorStop(0,   "rgba(255,61,0,0.4)");
        pg.addColorStop(0.5, "#FF3D00");
        pg.addColorStop(1,   "rgba(255,61,0,0.4)");
        ctx.fillStyle = pg;
        fillRR(ctx, px, py, pw, ph, 5); ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Ball ──
      if (g.phase === "playing") {
        // Trail — warm orange fading
        b.trail.forEach((pt, i) => {
          const frac = i / b.trail.length;
          ctx.fillStyle = `rgba(255,61,0,${frac * 0.4})`;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, BALL_R * 0.6 * frac, 0, Math.PI * 2); ctx.fill();
        });

        // Ball with squash/stretch
        ctx.shadowColor = "rgba(255,61,0,0.75)";
        ctx.shadowBlur  = 20;
        ctx.fillStyle   = "#FF3D00";
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.scale(b.sx, b.sy);
        ctx.beginPath(); ctx.arc(0, 0, BALL_R, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        ctx.shadowBlur = 0;

        // Specular highlight (fixed offset, not squashed)
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath(); ctx.arc(b.x - 3, b.y - 3, BALL_R * 0.32, 0, Math.PI * 2); ctx.fill();
      }

      // ── HUD ──
      ctx.textAlign     = "left";
      ctx.fillStyle     = "#FF3D00";
      ctx.font          = "700 10px system-ui, sans-serif";
      ctx.letterSpacing = "3px";
      ctx.fillText("PINBALL", 18, 25);
      ctx.letterSpacing = "0px";

      // Lives dots
      for (let l = 0; l < 3; l++) {
        ctx.beginPath();
        ctx.arc(19 + l * 14, 42, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = l < g.lives ? "#FF3D00" : "rgba(0,0,0,0.1)";
        ctx.fill();
      }

      // Score
      ctx.textAlign = "right";
      ctx.font      = "800 46px system-ui, sans-serif";
      ctx.fillStyle = "#111111";
      ctx.fillText(String(g.score).padStart(2, "0"), W - 18, 50);

      ctx.font      = "600 9px system-ui, sans-serif";
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillText(`BEST  ${g.hi}`, W - 18, 64);

      // Divider
      ctx.strokeStyle = "rgba(0,0,0,0.07)";
      ctx.lineWidth   = 1;
      ctx.beginPath(); ctx.moveTo(0, 74); ctx.lineTo(W, 74); ctx.stroke();

      // ── Idle hint ──
      if (g.phase === "idle") {
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.font      = "600 11px system-ui, sans-serif";
        ctx.fillText("MOVE MOUSE  ·  CLICK TO PLAY", W / 2, H - 18);
      }

      // ── Relaunching hint ──
      if (g.phase === "relaunching") {
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.font      = "600 11px system-ui, sans-serif";
        ctx.fillText("LAUNCHING…", W / 2, H - 18);
      }

      // ── Game Over overlay ──
      if (g.phase === "over") {
        ctx.fillStyle = "rgba(245,243,239,0.93)";
        ctx.fillRect(0, 0, W, H);

        ctx.textAlign     = "center";
        ctx.fillStyle     = "rgba(0,0,0,0.3)";
        ctx.font          = "700 10px system-ui, sans-serif";
        ctx.letterSpacing = "4px";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 70);
        ctx.letterSpacing = "0px";

        ctx.shadowColor = "rgba(255,61,0,0.3)";
        ctx.shadowBlur  = 20;
        ctx.fillStyle   = "#FF3D00";
        ctx.font        = "800 80px system-ui, sans-serif";
        ctx.fillText(String(g.score), W / 2, H / 2 - 8);
        ctx.shadowBlur  = 0;

        ctx.fillStyle     = g.newBest ? "#10B981" : "rgba(0,0,0,0.28)";
        ctx.font          = "700 10px system-ui, sans-serif";
        ctx.letterSpacing = "2px";
        ctx.fillText(g.newBest ? "NEW BEST!" : `BEST  ${g.hi}`, W / 2, H / 2 + 18);
        ctx.letterSpacing = "0px";

        const BW = 138, BH = 42;
        const bx  = W / 2 - BW / 2, by = H / 2 + 40;
        ctx.shadowColor = "rgba(255,61,0,0.35)";
        ctx.shadowBlur  = 16;
        ctx.fillStyle   = "#FF3D00";
        fillRR(ctx, bx, by, BW, BH, 21); ctx.fill();
        ctx.shadowBlur  = 0;

        ctx.fillStyle = "#fff";
        ctx.font      = "700 13px system-ui, sans-serif";
        ctx.fillText("PLAY AGAIN", W / 2, by + 26);
      }
    }

    function loop() {
      update();
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent) {
      mxRef.current = e.clientX - canvas.getBoundingClientRect().left;
    }

    function onClick(e: MouseEvent) {
      const g = G.current;
      if (g.phase === "idle") { startGame(); return; }
      if (g.phase === "over") {
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
        const BW = 138, BH = 42;
        const bx = g.W / 2 - BW / 2, by = g.H / 2 + 40;
        if (cx >= bx && cx <= bx + BW && cy >= by && cy <= by + BH) startGame();
      }
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      mxRef.current = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    }

    resize();
    try { G.current.hi = parseInt(localStorage.getItem("nm-pinball-hs") || "0") || 0; } catch {}
    loop();

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click",     onClick);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click",     onClick);
      canvas.removeEventListener("touchmove", onTouchMove);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full h-full relative" style={{ cursor: "none" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
