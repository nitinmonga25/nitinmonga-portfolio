"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Color Math ───────────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function getLuminance(hex: string): number {
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const [r, g, b] = hexToRgb(hex).map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = getLuminance(fg), l2 = getLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function textOnBg(hex: string): string {
  return getLuminance(hex) > 0.35 ? "#111111" : "#ffffff";
}

// ─── Shade Scale ──────────────────────────────────────────────────────────────

const SHADE_STOPS = [
  { stop: "50",  l: 97, f: 0.10 },
  { stop: "100", l: 93, f: 0.22 },
  { stop: "200", l: 85, f: 0.43 },
  { stop: "300", l: 74, f: 0.65 },
  { stop: "400", l: 61, f: 0.86 },
  { stop: "500", l: 50, f: 1.00 },
  { stop: "600", l: 40, f: 1.00 },
  { stop: "700", l: 31, f: 0.92 },
  { stop: "800", l: 22, f: 0.80 },
  { stop: "900", l: 14, f: 0.62 },
  { stop: "950", l: 9,  f: 0.44 },
];

function buildShades(h: number, s: number) {
  return SHADE_STOPS.map(({ stop, l, f }) => ({
    stop,
    hex: hslToHex(h, Math.min(Math.round(s * f), 100), l),
  }));
}

// ─── Harmony ─────────────────────────────────────────────────────────────────

type HarmonyId = "monochromatic" | "analogous" | "complementary" | "split" | "triadic" | "tetradic";

const HARMONIES: { id: HarmonyId; label: string; desc: string }[] = [
  { id: "monochromatic", label: "Mono",          desc: "5 variations of one hue"          },
  { id: "analogous",     label: "Analogous",     desc: "5 hues within ±30°"               },
  { id: "complementary", label: "Complementary", desc: "Opposite hues + accents"           },
  { id: "split",         label: "Split",         desc: "Base + two near-complements"       },
  { id: "triadic",       label: "Triadic",       desc: "3 hues equally spaced at 120°"    },
  { id: "tetradic",      label: "Tetradic",      desc: "4 hues equally spaced at 90°"     },
];

const wh = (h: number) => ((h % 360) + 360) % 360;

function getHarmonyColors(h: number, s: number, l: number, type: HarmonyId) {
  switch (type) {
    case "monochromatic": return [
      { h, s,                    l,                    name: "Base"      },
      { h, s: Math.min(s+22,100),l,                    name: "Saturated" },
      { h, s: Math.max(s-28,5),  l,                    name: "Muted"     },
      { h, s: Math.max(s-38,5),  l: Math.min(l+22,94), name: "Pastel"   },
      { h, s,                    l: Math.max(l-18,8),  name: "Deep"      },
    ];
    case "analogous": return [
      { h: wh(h-30), s, l, name: "−30°" },
      { h: wh(h-15), s, l, name: "−15°" },
      { h,           s, l, name: "Base"  },
      { h: wh(h+15), s, l, name: "+15°" },
      { h: wh(h+30), s, l, name: "+30°" },
    ];
    case "complementary": return [
      { h,           s,                   l,                   name: "Primary"      },
      { h,           s: Math.max(s-20,5), l: Math.min(l+20,92),name: "Primary Tint" },
      { h: wh(h+180),s,                   l,                   name: "Complement"   },
      { h: wh(h+180),s: Math.max(s-20,5), l: Math.min(l+20,92),name: "Compl. Tint" },
      { h: wh(h+90), s: Math.max(s-25,5), l,                   name: "Accent"       },
    ];
    case "split": return [
      { h,           s, l, name: "Primary" },
      { h: wh(h+150),s, l, name: "Split A"  },
      { h: wh(h+210),s, l, name: "Split B"  },
    ];
    case "triadic": return [
      { h,           s, l, name: "Primary"   },
      { h: wh(h+120),s, l, name: "Secondary" },
      { h: wh(h+240),s, l, name: "Tertiary"  },
    ];
    case "tetradic": return [
      { h,           s, l, name: "Primary"    },
      { h: wh(h+90), s, l, name: "Secondary"  },
      { h: wh(h+180),s, l, name: "Tertiary"   },
      { h: wh(h+270),s, l, name: "Quaternary" },
    ];
  }
}

// ─── Color naming ─────────────────────────────────────────────────────────────

function colorName(h: number, s: number, l: number): string {
  if (s < 8) { return l > 90 ? "White" : l < 15 ? "Black" : "Gray"; }
  if (l > 93) return "Near White";
  if (l < 7)  return "Near Black";
  if (h < 12  || h >= 348) return "Red";
  if (h < 28)  return "Red Orange";
  if (h < 45)  return "Orange";
  if (h < 58)  return "Amber";
  if (h < 72)  return "Yellow";
  if (h < 92)  return "Yellow Green";
  if (h < 150) return "Green";
  if (h < 168) return "Teal";
  if (h < 200) return "Cyan";
  if (h < 245) return "Blue";
  if (h < 262) return "Indigo";
  if (h < 288) return "Violet";
  if (h < 320) return "Purple";
  return "Pink";
}

// ─── Export builders ──────────────────────────────────────────────────────────

type ExportTab = "css" | "tailwind" | "scss";

type PaletteColor = {
  name:   string;
  h:      number;
  s:      number;
  l:      number;
  shades: { stop: string; hex: string }[];
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function buildExport(colors: PaletteColor[], name: string, tab: ExportTab): string {
  const n = name.trim() || "primary";

  if (tab === "css") {
    const lines = [":root {"];
    colors.forEach(({ name: cName, shades }) => {
      const key = colors.length === 1 ? n : `${n}-${slug(cName)}`;
      shades.forEach(({ stop, hex }) => lines.push(`  --color-${key}-${stop}: ${hex};`));
    });
    lines.push("}");
    return lines.join("\n");
  }

  if (tab === "tailwind") {
    const lines = [
      "// tailwind.config.js",
      "module.exports = {",
      "  theme: {",
      "    extend: {",
      "      colors: {",
    ];
    colors.forEach(({ name: cName, shades }) => {
      const key = colors.length === 1 ? n : `${n}-${slug(cName)}`;
      lines.push(`        '${key}': {`);
      shades.forEach(({ stop, hex }) => lines.push(`          '${stop}': '${hex}',`));
      lines.push("        },");
    });
    lines.push("      },", "    },", "  },", "};");
    return lines.join("\n");
  }

  // scss
  const lines: string[] = [];
  colors.forEach(({ name: cName, shades }) => {
    const key = colors.length === 1 ? n : `${n}-${slug(cName)}`;
    shades.forEach(({ stop, hex }) => lines.push(`$color-${key}-${stop}: ${hex};`));
    lines.push("");
  });
  return lines.join("\n").trimEnd();
}

// ─── Random color ─────────────────────────────────────────────────────────────

function randomHex(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 55 + Math.floor(Math.random() * 30);
  const l = 38 + Math.floor(Math.random() * 20);
  return hslToHex(h, s, l);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ColorPaletteGenerator() {
  const [baseHex,    setBaseHex]    = useState("#FF3D00");
  const [hexInput,   setHexInput]   = useState("#FF3D00");
  const [harmony,    setHarmony]    = useState<HarmonyId>("analogous");
  const [exportTab,  setExportTab]  = useState<ExportTab>("css");
  const [exportName, setExportName] = useState("primary");
  const [toast,      setToast]      = useState("");
  const [copiedHex,  setCopiedHex]  = useState<string | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived state
  const [h, s, l] = hexToHsl(baseHex);
  const harmonyColors = getHarmonyColors(h, s, l, harmony);
  const palette: PaletteColor[] = harmonyColors.map((c) => ({
    ...c,
    shades: buildShades(c.h, c.s),
  }));
  const [rr, gg, bb] = hexToRgb(baseHex);
  const exportCode = buildExport(palette, exportName, exportTab);

  // Copy handler
  const copy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedHex(text);
      setToast(`Copied ${label}`);
      if (toastRef.current) clearTimeout(toastRef.current);
      toastRef.current = setTimeout(() => { setToast(""); setCopiedHex(null); }, 1800);
    });
  }, []);

  // Hex input
  function handleHexInput(val: string) {
    setHexInput(val);
    const clean = val.startsWith("#") ? val : `#${val}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) setBaseHex(clean.toLowerCase());
  }

  function handleColorPicker(val: string) {
    setBaseHex(val);
    setHexInput(val.toUpperCase());
  }

  function randomize() {
    const hex = randomHex();
    setBaseHex(hex);
    setHexInput(hex.toUpperCase());
  }

  // Spacebar shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        randomize();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-28 pb-20">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-10">
          <Link
            href="/tools/"
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors group"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-0.5 transition-transform duration-200">
              <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Tools
          </Link>
          <span style={{ color: "var(--color-border)" }}>/</span>
          <span className="font-body text-[13px] text-[var(--color-ink)]">Color Palette Generator</span>
        </div>

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="section-label mb-3">// Design Tools</p>
            <h1
              className="font-display font-bold text-[var(--color-ink)] leading-tight"
              style={{ fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.025em" }}
            >
              Color Palette<br />
              <span className="text-[var(--color-accent)]">Generator</span>
            </h1>
            <p className="font-body text-[var(--color-muted)] mt-3 max-w-[440px] leading-relaxed" style={{ fontSize: "15px" }}>
              Pick a base color, choose a harmony rule — get a full 11-shade design system ready to export.
            </p>
          </div>

          {/* Base color info card */}
          <div
            className="flex items-center gap-4 px-5 py-4 rounded-2xl flex-shrink-0"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <div
              className="w-14 h-14 rounded-xl flex-shrink-0 shadow-sm"
              style={{ background: baseHex, border: "2px solid var(--color-border)" }}
            />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[15px] font-bold text-[var(--color-ink)]">{baseHex.toUpperCase()}</span>
              <span className="font-body text-[12px] text-[var(--color-muted)]">rgb({rr}, {gg}, {bb})</span>
              <span className="font-body text-[12px] text-[var(--color-muted)]">hsl({h}, {s}%, {l}%)</span>
            </div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div
          className="flex flex-wrap items-center gap-3 p-4 lg:p-5 mb-6 rounded-2xl"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          {/* Color picker */}
          <label className="relative cursor-pointer group" title="Click to pick a color">
            <div
              className="w-11 h-11 rounded-xl transition-all group-hover:scale-105 group-hover:shadow-md"
              style={{ background: baseHex, border: "2px solid var(--color-border)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            />
            <input
              type="color"
              value={baseHex}
              onChange={(e) => handleColorPicker(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </label>

          {/* Hex input */}
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexInput(e.target.value)}
            maxLength={7}
            placeholder="#FF3D00"
            spellCheck={false}
            className="font-mono text-[14px] px-3 py-2.5 rounded-xl outline-none w-[112px] tracking-wider uppercase transition-all"
            style={{
              background:  "var(--color-bg)",
              border:      "1px solid var(--color-border)",
              color:       "var(--color-ink)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--color-border)")}
          />

          <div className="w-px h-8 hidden sm:block flex-shrink-0" style={{ background: "var(--color-border)" }} />

          {/* Harmony selector */}
          <div className="flex items-center gap-1 flex-wrap">
            {HARMONIES.map(({ id, label, desc }) => (
              <button
                key={id}
                onClick={() => setHarmony(id)}
                title={desc}
                className="font-body text-[13px] px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap"
                style={{
                  background: harmony === id ? "var(--color-accent)" : "var(--color-bg)",
                  color:      harmony === id ? "#fff" : "var(--color-muted)",
                  fontWeight: harmony === id ? 600 : 400,
                  border:     `1px solid ${harmony === id ? "var(--color-accent)" : "var(--color-border)"}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Randomize */}
          <button
            onClick={randomize}
            title="Randomize palette (Spacebar)"
            className="ml-auto flex items-center gap-2 px-4 py-2.5 font-body text-[13px] font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-ink)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 4h3l8 0M9.5 1.5L12 4l-2.5 2.5M1 10h3l8 0M9.5 7.5L12 10l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Randomize
            <kbd
              className="hidden lg:inline-block font-body text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: "var(--color-border)", color: "var(--color-muted)" }}
            >
              Space
            </kbd>
          </button>
        </div>

        {/* ── Palette ── */}
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          {/* Column headers */}
          <div
            className="flex items-center px-5 py-2.5 border-b"
            style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
          >
            <div className="flex-shrink-0 pr-4" style={{ width: 144 }}>
              <span className="font-body text-[10px] font-semibold uppercase tracking-[2px] text-[var(--color-muted)]">Color</span>
            </div>
            <div className="flex flex-1 min-w-0 overflow-x-auto gap-1">
              {SHADE_STOPS.map(({ stop }) => (
                <div key={stop} className="flex-1 text-center font-mono text-[9px] font-semibold text-[var(--color-muted)] min-w-[44px]">
                  {stop}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div>
            {palette.map(({ name, h: ch, s: cs, l: cl, shades }, ri) => (
              <div
                key={name}
                className="flex items-stretch px-5 py-3"
                style={{ borderBottom: ri < palette.length - 1 ? "1px solid var(--color-border)" : "none" }}
              >
                {/* Label */}
                <div className="flex flex-col justify-center pr-4 flex-shrink-0" style={{ width: 144 }}>
                  <p className="font-display text-[13px] font-bold text-[var(--color-ink)] leading-tight">{name}</p>
                  <p className="font-body text-[11px] text-[var(--color-muted)] mt-0.5">{colorName(ch, cs, cl)}</p>
                  <p className="font-mono text-[10px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {hslToHex(ch, cs, cl).toUpperCase()}
                  </p>
                </div>

                {/* Shades */}
                <div className="flex flex-1 gap-1 min-w-0 overflow-x-auto">
                  {shades.map(({ stop, hex }) => {
                    const fg = textOnBg(hex);
                    const cr = contrastRatio(hex, "#ffffff").toFixed(1);
                    const isCopied = copiedHex === hex;
                    return (
                      <button
                        key={stop}
                        onClick={() => copy(hex, `${hex.toUpperCase()}`)}
                        title={`${stop}: ${hex.toUpperCase()} · Contrast vs white: ${cr}:1`}
                        className="group relative flex-1 rounded-lg overflow-hidden transition-all duration-150 hover:scale-y-[1.08] hover:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] min-w-[44px]"
                        style={{ height: 80, background: hex }}
                      >
                        {/* Stop label */}
                        <span
                          className="absolute bottom-1.5 left-0 right-0 text-center font-mono text-[9px] font-medium opacity-50 group-hover:opacity-0 transition-opacity select-none"
                          style={{ color: fg }}
                        >
                          {stop}
                        </span>

                        {/* Hover overlay */}
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-150"
                          style={{ background: "rgba(0,0,0,0.28)" }}
                        >
                          <span className="font-mono text-[10px] font-bold text-white drop-shadow-sm">
                            {hex.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <rect x="0.5" y="3" width="6.5" height="6.5" rx="1" stroke="rgba(255,255,255,0.8)" strokeWidth="0.9"/>
                              <path d="M3 3V2a1 1 0 011-1h3.5a1 1 0 011 1V5a1 1 0 01-1 1H7" stroke="rgba(255,255,255,0.8)" strokeWidth="0.9"/>
                            </svg>
                            <span className="font-body text-[9px] text-white/80">Copy</span>
                          </div>
                        </div>

                        {/* Copied flash */}
                        {isCopied && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg" style={{ background: "rgba(16,185,129,0.75)" }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contrast quick view ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6"
        >
          {palette[0]?.shades.slice(4).map(({ stop, hex }) => {
            const onWhite  = contrastRatio(hex, "#ffffff");
            const onBlack  = contrastRatio(hex, "#111111");
            const wcagAA   = onWhite >= 4.5 || onBlack >= 4.5;
            const wcagAAA  = onWhite >= 7   || onBlack >= 7;
            return (
              <div
                key={stop}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <div className="w-8 h-8 rounded-lg" style={{ background: hex }} />
                <span className="font-mono text-[10px] font-semibold text-[var(--color-ink)]">{stop}</span>
                <div className="flex gap-1">
                  <span
                    className="font-body text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: wcagAA ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: wcagAA ? "#059669" : "#dc2626" }}
                  >
                    AA
                  </span>
                  <span
                    className="font-body text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: wcagAAA ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: wcagAAA ? "#059669" : "#dc2626" }}
                  >
                    AAA
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Export Panel ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
        >
          {/* Export header */}
          <div
            className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b"
            style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <p className="section-label">// Export</p>
              <div className="flex items-center gap-1">
                {(["css", "tailwind", "scss"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setExportTab(tab)}
                    className="font-body text-[13px] px-3 py-1.5 rounded-lg transition-all duration-150 font-medium"
                    style={{
                      background: exportTab === tab ? "var(--color-accent)" : "transparent",
                      color:      exportTab === tab ? "#fff" : "var(--color-muted)",
                      border:     `1px solid ${exportTab === tab ? "var(--color-accent)" : "var(--color-border)"}`,
                    }}
                  >
                    {tab === "css" ? "CSS Variables" : tab === "tailwind" ? "Tailwind" : "SCSS"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="font-body text-[12px] text-[var(--color-muted)] whitespace-nowrap">Color name:</label>
                <input
                  type="text"
                  value={exportName}
                  onChange={(e) => setExportName(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="primary"
                  className="font-mono text-[13px] px-2.5 py-1.5 rounded-lg outline-none w-24 transition-all"
                  style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-ink)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--color-border)")}
                />
              </div>
              <button
                onClick={() => copy(exportCode, "code")}
                className="flex items-center gap-2 px-4 py-2 font-body text-[13px] font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 text-white flex-shrink-0"
                style={{ background: "var(--color-accent)", boxShadow: "0 4px 14px rgba(255,61,0,0.25)" }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="0.5" y="4" width="8" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4 4V2.5A1.5 1.5 0 015.5 1h5A1.5 1.5 0 0112 2.5v5A1.5 1.5 0 0110.5 9H9" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                Copy All
              </button>
            </div>
          </div>

          {/* Code */}
          <pre
            className="p-5 overflow-auto"
            style={{ maxHeight: 320, background: "#fafafa", color: "var(--color-ink)" }}
          >
            <code className="font-mono text-[12.5px] leading-[1.75]">{exportCode}</code>
          </pre>
        </div>

        {/* Tip line */}
        <p className="font-body text-[12px] text-center mt-5 text-[var(--color-muted)]">
          Click any swatch to copy its hex value · Press{" "}
          <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded mx-0.5" style={{ background: "var(--color-border)", color: "var(--color-muted)" }}>
            Space
          </kbd>
          {" "}to randomize
        </p>

      </div>

      {/* ── Toast ── */}
      <div
        aria-live="polite"
        className="fixed bottom-6 left-1/2 z-50 pointer-events-none"
        style={{
          transform:  `translateX(-50%) translateY(${toast ? "0px" : "16px"})`,
          opacity:    toast ? 1 : 0,
          transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full font-body text-[13px] font-semibold text-white shadow-2xl"
          style={{ background: "#111", backdropFilter: "blur(16px)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3.5 6-6" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {toast}
        </div>
      </div>
    </div>
  );
}
