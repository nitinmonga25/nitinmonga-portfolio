"use client";

import { useState, useEffect, useRef, useCallback, DragEvent } from "react";
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
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}

function getLuminance(hex: string): number {
  const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const [r, g, b] = hexToRgb(hex).map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string) {
  const l1 = getLuminance(a), l2 = getLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function textOnBg(hex: string) { return getLuminance(hex) > 0.35 ? "#111111" : "#ffffff"; }

const wh = (h: number) => ((h % 360) + 360) % 360;

// ─── Shade Scale ──────────────────────────────────────────────────────────────

const SHADE_STOPS = [
  { stop:"50",  l:97, f:0.10 }, { stop:"100", l:93, f:0.22 }, { stop:"200", l:85, f:0.43 },
  { stop:"300", l:74, f:0.65 }, { stop:"400", l:61, f:0.86 }, { stop:"500", l:50, f:1.00 },
  { stop:"600", l:40, f:1.00 }, { stop:"700", l:31, f:0.92 }, { stop:"800", l:22, f:0.80 },
  { stop:"900", l:14, f:0.62 }, { stop:"950", l:9,  f:0.44 },
];

function buildShades(h: number, s: number) {
  return SHADE_STOPS.map(({ stop, l, f }) => ({
    stop, hex: hslToHex(h, Math.min(Math.round(s * f), 100), l),
  }));
}

// ─── Harmony ─────────────────────────────────────────────────────────────────

type HarmonyId = "monochromatic"|"analogous"|"complementary"|"split"|"triadic"|"tetradic";

const HARMONIES: { id: HarmonyId; label: string; desc: string }[] = [
  { id:"monochromatic", label:"Mono",          desc:"5 variations of one hue"       },
  { id:"analogous",     label:"Analogous",     desc:"5 hues within ±30°"            },
  { id:"complementary", label:"Complementary", desc:"Opposite hues + accents"        },
  { id:"split",         label:"Split",         desc:"Base + two near-complements"    },
  { id:"triadic",       label:"Triadic",       desc:"3 hues equally at 120°"        },
  { id:"tetradic",      label:"Tetradic",      desc:"4 hues equally at 90°"         },
];

function getHarmonyColors(h: number, s: number, l: number, type: HarmonyId) {
  switch (type) {
    case "monochromatic": return [
      { h, s,                    l,                    name:"Base"       },
      { h, s:Math.min(s+22,100), l,                    name:"Saturated"  },
      { h, s:Math.max(s-28,5),   l,                    name:"Muted"      },
      { h, s:Math.max(s-38,5),   l:Math.min(l+22,94),  name:"Pastel"    },
      { h, s,                    l:Math.max(l-18,8),   name:"Deep"       },
    ];
    case "analogous": return [
      { h:wh(h-30), s, l, name:"−30°" }, { h:wh(h-15), s, l, name:"−15°" },
      { h,          s, l, name:"Base"  }, { h:wh(h+15), s, l, name:"+15°" },
      { h:wh(h+30), s, l, name:"+30°" },
    ];
    case "complementary": return [
      { h,           s,                   l,                    name:"Primary"      },
      { h,           s:Math.max(s-20,5),  l:Math.min(l+20,92),  name:"Primary Tint" },
      { h:wh(h+180), s,                   l,                    name:"Complement"   },
      { h:wh(h+180), s:Math.max(s-20,5),  l:Math.min(l+20,92),  name:"Compl. Tint" },
      { h:wh(h+90),  s:Math.max(s-25,5),  l,                    name:"Accent"       },
    ];
    case "split":   return [
      { h,           s, l, name:"Primary" }, { h:wh(h+150), s, l, name:"Split A" },
      { h:wh(h+210), s, l, name:"Split B" },
    ];
    case "triadic":  return [
      { h,           s, l, name:"Primary" }, { h:wh(h+120), s, l, name:"Secondary" },
      { h:wh(h+240), s, l, name:"Tertiary" },
    ];
    case "tetradic": return [
      { h,           s, l, name:"Primary"   }, { h:wh(h+90),  s, l, name:"Secondary"  },
      { h:wh(h+180), s, l, name:"Tertiary"  }, { h:wh(h+270), s, l, name:"Quaternary" },
    ];
  }
}

function colorName(h: number, s: number, l: number): string {
  if (s < 8) return l > 90 ? "White" : l < 15 ? "Black" : "Gray";
  if (l > 93) return "Near White"; if (l < 7) return "Near Black";
  if (h < 12 || h >= 348) return "Red";
  if (h < 28)  return "Red Orange"; if (h < 45) return "Orange";
  if (h < 58)  return "Amber";      if (h < 72) return "Yellow";
  if (h < 92)  return "Yellow Green"; if (h < 150) return "Green";
  if (h < 168) return "Teal";       if (h < 200) return "Cyan";
  if (h < 245) return "Blue";       if (h < 262) return "Indigo";
  if (h < 288) return "Violet";     if (h < 320) return "Purple";
  return "Pink";
}

// ─── Curated Palettes ─────────────────────────────────────────────────────────

type Mood = "All"|"Warm"|"Cool"|"Natural"|"Vibrant"|"Dark"|"Soft";
const MOODS: Mood[] = ["All","Warm","Cool","Natural","Vibrant","Dark","Soft"];

interface CPalette { id:number; name:string; mood:Mood; colors:string[] }

const CURATED: CPalette[] = [
  { id:1,  name:"Forest Walk",    mood:"Natural",  colors:["#e5eae2","#8b7355","#c49890","#f2ccd4"] },
  { id:2,  name:"Electric Pop",   mood:"Vibrant",  colors:["#a8dce3","#e8187c","#00c4c4","#ffd020"] },
  { id:3,  name:"Dark Earth",     mood:"Dark",     colors:["#7a2828","#5c3c2c","#302c2c","#181818"] },
  { id:4,  name:"Desert Gold",    mood:"Warm",     colors:["#8b5e38","#c4a040","#f5efe0","#c8a048"] },
  { id:5,  name:"Sunset Harvest", mood:"Warm",     colors:["#e87828","#8b8010","#5c6c10","#e8d8c0"] },
  { id:6,  name:"Ocean Rust",     mood:"Cool",     colors:["#487888","#78b0bc","#8b5838","#201018"] },
  { id:7,  name:"Silver Teal",    mood:"Cool",     colors:["#d4d4d4","#487880","#b89080","#c47030"] },
  { id:8,  name:"Autumn Spice",   mood:"Warm",     colors:["#e88028","#8b8818","#f07858","#e8d8b8"] },
  { id:9,  name:"Midnight Party", mood:"Vibrant",  colors:["#2c1840","#e07038","#e8b840","#00d8f0"] },
  { id:10, name:"Espresso",       mood:"Dark",     colors:["#3c2820","#785040","#987868","#140c08"] },
  { id:11, name:"Lime & Teal",    mood:"Vibrant",  colors:["#c8cc00","#007058","#44a8d8","#e83808"] },
  { id:12, name:"Dusty Rose",     mood:"Soft",     colors:["#c89090","#e8c0c0","#f0e0e0","#9c6464"] },
  { id:13, name:"Nordic Night",   mood:"Cool",     colors:["#2c3c50","#485870","#8898b0","#c8d8e8"] },
  { id:14, name:"Tropical Punch", mood:"Vibrant",  colors:["#ff6040","#ff9840","#40d890","#4890ff"] },
  { id:15, name:"Lavender Mist",  mood:"Soft",     colors:["#9878c8","#c8a8e8","#e8d8f8","#5848a0"] },
  { id:16, name:"Olive Grove",    mood:"Natural",  colors:["#606820","#a0a060","#e8e0c8","#484010"] },
  { id:17, name:"Coral Reef",     mood:"Warm",     colors:["#ff7f6e","#ffb88c","#c8e0d8","#4a8880"] },
  { id:18, name:"Deep Ocean",     mood:"Dark",     colors:["#0c1428","#1c3460","#4870a0","#88b0e0"] },
  { id:19, name:"Sage & Blush",   mood:"Natural",  colors:["#8fa888","#c8d8c0","#f0ddd5","#d4908c"] },
  { id:20, name:"Neon Night",     mood:"Vibrant",  colors:["#0a0a1a","#ff0080","#00ff88","#8000ff"] },
  { id:21, name:"Warm Minimal",   mood:"Soft",     colors:["#f5f0e8","#e8d8c0","#c0a880","#805840"] },
  { id:22, name:"Glacier",        mood:"Cool",     colors:["#e8f4f8","#a8d0e0","#5898b8","#2868a0"] },
  { id:23, name:"Terracotta",     mood:"Warm",     colors:["#c86840","#e0a888","#f5e0d8","#804828"] },
  { id:24, name:"Forest Shadow",  mood:"Dark",     colors:["#1a2810","#304820","#587840","#88a868"] },
  { id:25, name:"Bubblegum",      mood:"Soft",     colors:["#ff9eb5","#ffc8d5","#b5d8f7","#d4b5f7"] },
  { id:26, name:"Bronze Age",     mood:"Natural",  colors:["#7c5c3c","#b8904c","#d4b878","#e8d8b0"] },
  { id:27, name:"Cyberpunk",      mood:"Vibrant",  colors:["#0d0d1a","#ff2d55","#00e5ff","#ffd600"] },
  { id:28, name:"Matcha",         mood:"Natural",  colors:["#3d5a2a","#7a9e5a","#c8d8a0","#f0ecd8"] },
];

function generateRandomPalette(): string[] {
  const baseH = Math.floor(Math.random() * 360);
  const type  = Math.floor(Math.random() * 4);
  const count = 4 + Math.floor(Math.random() * 2);
  const hues: number[] = [];
  if (type === 0) for (let i=0;i<count;i++) hues.push(wh(baseH+(i-Math.floor(count/2))*28));
  else if (type === 1) for (let i=0;i<count;i++) hues.push(i<2?wh(baseH+i*18):wh(baseH+180+(i-2)*18));
  else for (let i=0;i<count;i++) hues.push(wh(baseH+i*(360/count)+Math.floor(Math.random()*20-10)));
  return hues.map((h) => hslToHex(h, 45+Math.floor(Math.random()*45), 20+Math.floor(Math.random()*55)));
}

// ─── Image extraction ─────────────────────────────────────────────────────────

function extractColors(img: HTMLImageElement, count = 6): string[] {
  const canvas = document.createElement("canvas");
  const MAX = 140;
  const sc = Math.min(MAX / img.naturalWidth, MAX / img.naturalHeight, 1);
  canvas.width  = Math.round(img.naturalWidth  * sc);
  canvas.height = Math.round(img.naturalHeight * sc);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const map = new Map<string, number>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i+3] < 128) continue;
    const r = Math.round(data[i]   / 24) * 24;
    const g = Math.round(data[i+1] / 24) * 24;
    const b = Math.round(data[i+2] / 24) * 24;
    const k = `${r},${g},${b}`;
    map.set(k, (map.get(k) ?? 0) + 1);
  }

  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  const result: [number,number,number][] = [];
  for (const [key] of sorted) {
    if (result.length >= count) break;
    const [r,g,b] = key.split(",").map(Number);
    const near = result.some(([r2,g2,b2]) => Math.sqrt((r-r2)**2+(g-g2)**2+(b-b2)**2) < 52);
    if (!near) result.push([r,g,b]);
  }
  return result.map(([r,g,b]) =>
    "#"+Math.min(r,255).toString(16).padStart(2,"0")+
       Math.min(g,255).toString(16).padStart(2,"0")+
       Math.min(b,255).toString(16).padStart(2,"0")
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

type ExportTab = "css"|"tailwind"|"scss";
type ShadeColor = { name:string; h:number; s:number; l:number; shades:{stop:string;hex:string}[] };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g,"");

function buildExport(colors: ShadeColor[], name: string, tab: ExportTab): string {
  const n = name.trim() || "primary";
  if (tab === "css") {
    const lines = [":root {"];
    colors.forEach(({ name:cn, shades }) => {
      const key = colors.length === 1 ? n : `${n}-${slug(cn)}`;
      shades.forEach(({ stop, hex }) => lines.push(`  --color-${key}-${stop}: ${hex};`));
    });
    lines.push("}");
    return lines.join("\n");
  }
  if (tab === "tailwind") {
    const lines = ["// tailwind.config.js","module.exports = {","  theme: {","    extend: {","      colors: {"];
    colors.forEach(({ name:cn, shades }) => {
      const key = colors.length === 1 ? n : `${n}-${slug(cn)}`;
      lines.push(`        '${key}': {`);
      shades.forEach(({ stop, hex }) => lines.push(`          '${stop}': '${hex}',`));
      lines.push("        },");
    });
    lines.push("      },","    },","  },","};");
    return lines.join("\n");
  }
  const lines: string[] = [];
  colors.forEach(({ name:cn, shades }) => {
    const key = colors.length === 1 ? n : `${n}-${slug(cn)}`;
    shades.forEach(({ stop, hex }) => lines.push(`$color-${key}-${stop}: ${hex};`));
    lines.push("");
  });
  return lines.join("\n").trimEnd();
}

function randomHex() {
  return hslToHex(Math.floor(Math.random()*360), 55+Math.floor(Math.random()*30), 38+Math.floor(Math.random()*20));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ msg }: { msg: string }) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 pointer-events-none"
      style={{ transform:`translateX(-50%) translateY(${msg?"0":"16px"})`, opacity:msg?1:0, transition:"all 0.25s cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full font-body text-[13px] font-semibold text-white shadow-2xl" style={{ background:"#111" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7l3 3.5 6-6" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {msg}
      </div>
    </div>
  );
}

function PaletteCard({ palette, onCopyColor, onCopyAll }: {
  palette: { name:string; colors:string[] };
  onCopyColor: (hex:string) => void;
  onCopyAll:   (colors:string[]) => void;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden" style={{ boxShadow:"0 2px 12px rgba(0,0,0,0.07)" }}>
      {/* Color bars */}
      <div className="flex" style={{ height: 88 }}>
        {palette.colors.map((color, i) => (
          <button
            key={i}
            onClick={() => onCopyColor(color)}
            title={color.toUpperCase()}
            className="flex-1 relative transition-all duration-150 hover:flex-[1.25]"
            style={{ background: color }}
          >
            <span
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              style={{ background:"rgba(0,0,0,0.22)" }}
            >
              <span className="font-mono text-[9px] text-white font-bold drop-shadow">{color.toUpperCase()}</span>
            </span>
          </button>
        ))}
      </div>
      {/* Footer */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background:"var(--color-surface)", borderTop:"1px solid var(--color-border)" }}
      >
        <p className="font-body text-[12px] font-semibold text-[var(--color-ink)] truncate">{palette.name}</p>
        <button
          onClick={() => onCopyAll(palette.colors)}
          className="flex-shrink-0 font-body text-[11px] px-2.5 py-1 rounded-lg transition-colors hover:bg-[var(--color-accent)] hover:text-white ml-2"
          style={{ background:"var(--color-bg)", color:"var(--color-muted)", border:"1px solid var(--color-border)" }}
        >
          Copy
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "shade"|"palettes"|"extract";

export function ColorPaletteGenerator() {
  const [activeTab,   setActiveTab]   = useState<Tab>("shade");

  // Shade Scale state
  const [baseHex,    setBaseHex]    = useState("#FF3D00");
  const [hexInput,   setHexInput]   = useState("#FF3D00");
  const [harmony,    setHarmony]    = useState<HarmonyId>("analogous");
  const [exportTab,  setExportTab]  = useState<ExportTab>("css");
  const [exportName, setExportName] = useState("primary");

  // Palettes state
  const [moodFilter,     setMoodFilter]     = useState<Mood>("All");
  const [randomPalettes, setRandomPalettes] = useState<string[][]>([]);
  const [copiedHex,      setCopiedHex]      = useState<string|null>(null);

  // Image extraction state
  const [imgSrc,       setImgSrc]       = useState<string|null>(null);
  const [extracted,    setExtracted]    = useState<string[]>([]);
  const [extracting,   setExtracting]   = useState(false);
  const [dragOver,     setDragOver]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);

  // Toast
  const [toast,     setToast]     = useState("");
  const toastTimer  = useRef<ReturnType<typeof setTimeout>|null>(null);

  // Shade Scale derived
  const [h, s, l]  = hexToHsl(baseHex);
  const harmonyColors = getHarmonyColors(h, s, l, harmony);
  const palette: ShadeColor[] = harmonyColors.map((c) => ({ ...c, shades: buildShades(c.h, c.s) }));
  const [rr,gg,bb]  = hexToRgb(baseHex);
  const exportCode  = buildExport(palette, exportName, exportTab);

  // Copy helper
  const copy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedHex(text);
      setToast(`Copied ${label}`);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => { setToast(""); setCopiedHex(null); }, 1800);
    });
  }, []);

  const copyPaletteAsCSS = (colors: string[]) => {
    const css = colors.map((c, i) => `--color-${i+1}: ${c};`).join("\n");
    copy(`:root {\n${css}\n}`, "palette");
  };

  // Hex input
  function handleHexInput(val: string) {
    setHexInput(val);
    const clean = val.startsWith("#") ? val : `#${val}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) setBaseHex(clean.toLowerCase());
  }
  function handleColorPicker(val: string) { setBaseHex(val); setHexInput(val.toUpperCase()); }
  function randomize() { const h = randomHex(); setBaseHex(h); setHexInput(h.toUpperCase()); }

  // Space = randomize
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) { e.preventDefault(); randomize(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate random palettes on mount + on demand
  function genRandom() {
    setRandomPalettes(Array.from({length:8}, generateRandomPalette));
  }
  useEffect(() => { genRandom(); }, []);

  // Image upload
  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setExtracted([]);
    setExtracting(true);
  }

  function handleImageLoad() {
    if (!imgRef.current) return;
    setTimeout(() => {
      const colors = extractColors(imgRef.current!);
      setExtracted(colors);
      setExtracting(false);
    }, 50);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const filteredCurated = moodFilter === "All"
    ? CURATED
    : CURATED.filter((p) => p.mood === moodFilter);

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-20">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/tools/" className="inline-flex items-center gap-1.5 font-body text-[13px] text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors group">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Tools
          </Link>
          <span style={{ color:"var(--color-border)" }}>/</span>
          <span className="font-body text-[13px] text-[var(--color-ink)]">Color Palette Generator</span>
        </div>

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div>
            <p className="section-label mb-3">// Design Tools</p>
            <h1 className="font-display font-bold text-[var(--color-ink)] leading-tight" style={{ fontSize:"clamp(26px,4vw,52px)", letterSpacing:"-0.025em" }}>
              Color Palette<br/><span className="text-[var(--color-accent)]">Generator</span>
            </h1>
            <p className="font-body text-[var(--color-muted)] mt-3 max-w-[440px] leading-relaxed text-[14px] sm:text-[15px]">
              Shade scales, curated palettes, and image color extraction — all in one place.
            </p>
          </div>
          <div
            className="flex items-center gap-4 px-4 py-3 rounded-2xl flex-shrink-0 self-start sm:self-auto"
            style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}
          >
            <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background:baseHex, border:"2px solid var(--color-border)" }} />
            <div>
              <p className="font-mono text-[14px] font-bold text-[var(--color-ink)]">{baseHex.toUpperCase()}</p>
              <p className="font-body text-[11px] text-[var(--color-muted)]">rgb({rr},{gg},{bb})</p>
              <p className="font-body text-[11px] text-[var(--color-muted)]">hsl({h},{s}%,{l}%)</p>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1.5 mb-6 flex-wrap">
          {([
            { id:"shade",    label:"Shade Scale",        icon:"M2 12h10M2 8h14M2 4h8" },
            { id:"palettes", label:"Palette Collections", icon:"M2 8h4v8H2zM7 4h4v12H7zM13 6h3v10h-3z" },
            { id:"extract",  label:"Extract from Image",  icon:"M3 3h18v14H3zM7 17l4 4 4-4" },
          ] as const).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-2.5 font-body text-[13px] font-medium rounded-xl transition-all duration-150"
              style={{
                background: activeTab===id ? "var(--color-accent)" : "var(--color-surface)",
                color:      activeTab===id ? "#fff" : "var(--color-muted)",
                border:     `1px solid ${activeTab===id ? "var(--color-accent)" : "var(--color-border)"}`,
                fontWeight: activeTab===id ? 600 : 400,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d={icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* TAB 1: Shade Scale                                            */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {activeTab === "shade" && (
          <>
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-5 mb-5 rounded-2xl" style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}>
              {/* Picker */}
              <label className="relative cursor-pointer group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all group-hover:scale-105" style={{ background:baseHex, border:"2px solid var(--color-border)" }} />
                <input type="color" value={baseHex} onChange={(e) => handleColorPicker(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"/>
              </label>

              <input
                type="text" value={hexInput}
                onChange={(e) => handleHexInput(e.target.value)}
                maxLength={7} placeholder="#FF3D00" spellCheck={false}
                className="font-mono text-[13px] px-3 py-2 rounded-xl outline-none w-[100px] sm:w-[112px] uppercase tracking-wider transition-all"
                style={{ background:"var(--color-bg)", border:"1px solid var(--color-border)", color:"var(--color-ink)" }}
                onFocus={(e)=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                onBlur={(e) =>(e.currentTarget.style.borderColor="var(--color-border)")}
              />

              <div className="w-px h-7 hidden sm:block" style={{ background:"var(--color-border)" }} />

              {/* Harmony */}
              <div className="flex items-center gap-1 flex-wrap">
                {HARMONIES.map(({ id, label, desc }) => (
                  <button key={id} onClick={() => setHarmony(id)} title={desc}
                    className="font-body text-[12px] sm:text-[13px] px-2.5 sm:px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap"
                    style={{
                      background: harmony===id ? "var(--color-accent)" : "var(--color-bg)",
                      color:      harmony===id ? "#fff" : "var(--color-muted)",
                      fontWeight: harmony===id ? 600 : 400,
                      border:     `1px solid ${harmony===id ? "var(--color-accent)" : "var(--color-border)"}`,
                    }}
                  >{label}</button>
                ))}
              </div>

              <button onClick={randomize} title="Randomize (Space)"
                className="ml-auto flex items-center gap-2 px-3 sm:px-4 py-2.5 font-body text-[13px] font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{ background:"var(--color-bg)", border:"1px solid var(--color-border)", color:"var(--color-ink)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 4h3l8 0M9.5 1.5L12 4l-2.5 2.5M1 10h3l8 0M9.5 7.5L12 10l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden sm:inline">Randomize</span>
                <kbd className="hidden lg:inline-block font-body text-[10px] px-1.5 py-0.5 rounded" style={{ background:"var(--color-border)", color:"var(--color-muted)" }}>Space</kbd>
              </button>
            </div>

            {/* Palette rows */}
            <div className="rounded-2xl overflow-hidden mb-5" style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}>
              {/* Header — desktop only */}
              <div className="hidden sm:flex items-center px-4 py-2.5 border-b" style={{ borderColor:"var(--color-border)", background:"var(--color-bg)" }}>
                <div className="flex-shrink-0 pr-3" style={{ width:130 }}>
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[2px] text-[var(--color-muted)]">Color</span>
                </div>
                <div className="flex flex-1 gap-1">
                  {SHADE_STOPS.map(({ stop }) => (
                    <div key={stop} className="flex-1 text-center font-mono text-[9px] font-semibold text-[var(--color-muted)] min-w-[36px]">{stop}</div>
                  ))}
                </div>
              </div>

              <div>
                {palette.map(({ name, h:ch, s:cs, l:cl, shades }, ri) => (
                  <div key={name} style={{ borderBottom: ri<palette.length-1 ? "1px solid var(--color-border)" : "none" }}>

                    {/* Mobile label */}
                    <div className="flex sm:hidden items-center gap-2 px-4 pt-3 pb-1">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:hslToHex(ch,cs,cl) }} />
                      <p className="font-body text-[12px] font-semibold text-[var(--color-ink)]">{name}</p>
                      <p className="font-body text-[11px] text-[var(--color-muted)]">· {colorName(ch,cs,cl)}</p>
                    </div>

                    <div className="flex items-stretch px-4 py-3">
                      {/* Desktop label */}
                      <div className="hidden sm:flex flex-col justify-center pr-3 flex-shrink-0" style={{ width:130 }}>
                        <p className="font-display text-[13px] font-bold text-[var(--color-ink)]">{name}</p>
                        <p className="font-body text-[11px] text-[var(--color-muted)]">{colorName(ch,cs,cl)}</p>
                        <p className="font-mono text-[10px] text-[var(--color-muted)]">{hslToHex(ch,cs,cl).toUpperCase()}</p>
                      </div>

                      {/* Shades */}
                      <div className="flex flex-1 gap-1 overflow-x-auto sm:overflow-x-visible pb-1 sm:pb-0">
                        {shades.map(({ stop, hex }) => {
                          const cr = contrastRatio(hex,"#ffffff").toFixed(1);
                          const isCopied = copiedHex === hex;
                          return (
                            <button
                              key={stop}
                              onClick={() => copy(hex, hex.toUpperCase())}
                              title={`${stop}: ${hex.toUpperCase()} · vs white ${cr}:1`}
                              className="group relative flex-1 rounded-lg overflow-hidden transition-all duration-150 hover:scale-y-[1.08] hover:z-10 focus:outline-none"
                              style={{ minWidth:36, height:64, background:hex }}
                            >
                              <span className="absolute bottom-1 left-0 right-0 text-center font-mono text-[8px] opacity-50 group-hover:opacity-0 transition-opacity select-none" style={{ color:textOnBg(hex) }}>
                                {stop}
                              </span>
                              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{ background:"rgba(0,0,0,0.28)" }}>
                                <span className="font-mono text-[9px] font-bold text-white drop-shadow">{hex.toUpperCase()}</span>
                              </div>
                              {isCopied && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg" style={{ background:"rgba(16,185,129,0.75)" }}>
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2.5 7l3 3.5 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WCAG strip */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-5">
              {palette[0]?.shades.slice(4).map(({ stop, hex }) => {
                const aa = contrastRatio(hex,"#ffffff") >= 4.5 || contrastRatio(hex,"#111") >= 4.5;
                const aaa = contrastRatio(hex,"#ffffff") >= 7   || contrastRatio(hex,"#111") >= 7;
                return (
                  <div key={stop} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl" style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)" }}>
                    <div className="w-7 h-7 rounded-lg" style={{ background:hex }} />
                    <span className="font-mono text-[9px] font-semibold text-[var(--color-ink)]">{stop}</span>
                    <div className="flex gap-1">
                      <span className="font-body text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background:aa?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)", color:aa?"#059669":"#dc2626" }}>AA</span>
                      <span className="font-body text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background:aaa?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)", color:aaa?"#059669":"#dc2626" }}>AAA</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Export */}
            <div className="rounded-2xl overflow-hidden" style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", boxShadow:"var(--shadow-card)" }}>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b" style={{ borderColor:"var(--color-border)", background:"var(--color-bg)" }}>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <p className="section-label">// Export</p>
                  <div className="flex items-center gap-1">
                    {(["css","tailwind","scss"] as const).map((tab) => (
                      <button key={tab} onClick={() => setExportTab(tab)}
                        className="font-body text-[12px] sm:text-[13px] px-2.5 sm:px-3 py-1.5 rounded-lg transition-all font-medium"
                        style={{ background:exportTab===tab?"var(--color-accent)":"transparent", color:exportTab===tab?"#fff":"var(--color-muted)", border:`1px solid ${exportTab===tab?"var(--color-accent)":"var(--color-border)"}` }}
                      >{tab === "css" ? "CSS" : tab === "tailwind" ? "Tailwind" : "SCSS"}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <input type="text" value={exportName} onChange={(e) => setExportName(e.target.value.toLowerCase().replace(/\s+/g,"-"))} placeholder="primary"
                    className="font-mono text-[12px] px-2.5 py-1.5 rounded-lg outline-none w-20 transition-all"
                    style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", color:"var(--color-ink)" }}
                    onFocus={(e)=>(e.currentTarget.style.borderColor="var(--color-accent)")}
                    onBlur={(e) =>(e.currentTarget.style.borderColor="var(--color-border)")}
                  />
                  <button onClick={() => copy(exportCode,"code")}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 font-body text-[12px] sm:text-[13px] font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 text-white"
                    style={{ background:"var(--color-accent)", boxShadow:"0 4px 12px rgba(255,61,0,0.25)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><rect x="0.5" y="4" width="8" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4V2.5A1.5 1.5 0 015.5 1h5A1.5 1.5 0 0112 2.5v5A1.5 1.5 0 0110.5 9H9" stroke="currentColor" strokeWidth="1.2"/></svg>
                    Copy All
                  </button>
                </div>
              </div>
              <pre className="p-4 sm:p-5 overflow-auto" style={{ maxHeight:280, background:"#fafafa", color:"var(--color-ink)" }}>
                <code className="font-mono text-[11.5px] sm:text-[12.5px] leading-[1.75]">{exportCode}</code>
              </pre>
            </div>

            <p className="font-body text-[11px] sm:text-[12px] text-center mt-4 text-[var(--color-muted)]">
              Click any swatch to copy hex · Press <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded mx-0.5" style={{ background:"var(--color-border)" }}>Space</kbd> to randomize
            </p>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* TAB 2: Palette Collections                                    */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {activeTab === "palettes" && (
          <>
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-1.5 flex-wrap">
                {MOODS.map((m) => (
                  <button key={m} onClick={() => setMoodFilter(m)}
                    className="font-body text-[12px] sm:text-[13px] px-3 py-1.5 rounded-full transition-all"
                    style={{
                      background: moodFilter===m ? "var(--color-accent)" : "var(--color-surface)",
                      color:      moodFilter===m ? "#fff" : "var(--color-muted)",
                      border:     `1px solid ${moodFilter===m ? "var(--color-accent)" : "var(--color-border)"}`,
                      fontWeight: moodFilter===m ? 600 : 400,
                    }}
                  >{m}</button>
                ))}
              </div>
              <button onClick={genRandom}
                className="flex items-center gap-2 px-4 py-2.5 font-body text-[13px] font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{ background:"var(--color-accent)", color:"#fff", boxShadow:"0 4px 12px rgba(255,61,0,0.25)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 4h3l8 0M9.5 1.5L12 4l-2.5 2.5M1 10h3l8 0M9.5 7.5L12 10l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Generate Random
              </button>
            </div>

            {/* Random generated — only visible when "All" filter is active */}
            {randomPalettes.length > 0 && moodFilter === "All" && (
              <div className="mb-8">
                <p className="font-body text-[11px] font-bold uppercase tracking-[3px] text-[var(--color-accent)] mb-4">Generated</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {randomPalettes.map((colors, i) => (
                    <PaletteCard key={i} palette={{ name:`Random ${i+1}`, colors }} onCopyColor={(h) => copy(h,h)} onCopyAll={copyPaletteAsCSS} />
                  ))}
                </div>
              </div>
            )}

            {/* Curated */}
            <div>
              <p className="font-body text-[11px] font-bold uppercase tracking-[3px] text-[var(--color-muted)] mb-4">
                {moodFilter === "All" ? "Curated" : moodFilter} — {filteredCurated.length} palettes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredCurated.map((p) => (
                  <PaletteCard key={p.id} palette={p} onCopyColor={(h) => copy(h,h)} onCopyAll={copyPaletteAsCSS} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* TAB 3: Extract from Image                                     */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {activeTab === "extract" && (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upload zone */}
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className="relative flex flex-col items-center justify-center gap-4 rounded-2xl cursor-pointer transition-all duration-200"
                  style={{
                    minHeight: 260,
                    border: `2px dashed ${dragOver ? "var(--color-accent)" : "var(--color-border)"}`,
                    background: dragOver ? "var(--color-accent-light)" : "var(--color-surface)",
                  }}
                >
                  {imgSrc ? (
                    /* Preview */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      ref={imgRef}
                      src={imgSrc}
                      alt="Uploaded"
                      onLoad={handleImageLoad}
                      className="w-full h-full object-contain rounded-2xl"
                      style={{ maxHeight:340, padding:12 }}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background:"var(--color-bg)" }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <rect x="2" y="4" width="24" height="18" rx="3" stroke="var(--color-muted)" strokeWidth="1.6"/>
                          <circle cx="9" cy="11" r="2.5" stroke="var(--color-muted)" strokeWidth="1.4"/>
                          <path d="M2 18l6-5 5 4 4-3 9 8" stroke="var(--color-muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="text-center px-4">
                        <p className="font-display text-[15px] font-bold text-[var(--color-ink)] mb-1">Drop an image here</p>
                        <p className="font-body text-[13px] text-[var(--color-muted)]">or click to browse · JPG, PNG, WEBP, GIF</p>
                      </div>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                </div>

                {imgSrc && (
                  <button
                    onClick={() => { setImgSrc(null); setExtracted([]); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="mt-3 font-body text-[12px] text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    ← Upload different image
                  </button>
                )}
              </div>

              {/* Extracted colors */}
              <div className="flex flex-col gap-4">
                <p className="section-label">// Extracted Palette</p>

                {extracting && (
                  <div className="flex items-center gap-3 py-8">
                    <div className="w-5 h-5 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
                    <p className="font-body text-[14px] text-[var(--color-muted)]">Extracting colors…</p>
                  </div>
                )}

                {!extracting && extracted.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 rounded-2xl text-center" style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)" }}>
                    <svg className="mb-3" width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M8 32C12 20 28 20 32 32" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="20" cy="16" r="6" stroke="var(--color-border)" strokeWidth="2"/>
                    </svg>
                    <p className="font-body text-[13px] text-[var(--color-muted)]">Upload an image to extract its dominant colors</p>
                  </div>
                )}

                {extracted.length > 0 && (
                  <>
                    {/* Big swatches */}
                    <div className="flex rounded-2xl overflow-hidden" style={{ height:100, border:"1px solid var(--color-border)" }}>
                      {extracted.map((hex, i) => (
                        <button
                          key={i}
                          onClick={() => copy(hex, hex.toUpperCase())}
                          title={hex.toUpperCase()}
                          className="flex-1 relative group transition-all hover:flex-[1.3]"
                          style={{ background:hex }}
                        >
                          <span className="absolute inset-0 flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background:"rgba(0,0,0,0.2)" }}>
                            <span className="font-mono text-[9px] text-white font-bold">{hex.toUpperCase()}</span>
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Color list */}
                    <div className="flex flex-col gap-2">
                      {extracted.map((hex, i) => {
                        const [rr,gg,bb] = hexToRgb(hex);
                        const [hh,ss,ll] = hexToHsl(hex);
                        const aa = contrastRatio(hex,"#ffffff") >= 4.5 || contrastRatio(hex,"#111") >= 4.5;
                        return (
                          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)" }}>
                            <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background:hex, border:"1px solid var(--color-border)" }} />
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-[13px] font-bold text-[var(--color-ink)]">{hex.toUpperCase()}</p>
                              <p className="font-body text-[11px] text-[var(--color-muted)]">rgb({rr},{gg},{bb}) · {colorName(hh,ss,ll)}</p>
                            </div>
                            <span className="font-body text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background:aa?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)", color:aa?"#059669":"#dc2626" }}>
                              {aa?"AA ✓":"AA ✗"}
                            </span>
                            <button onClick={() => copy(hex, hex.toUpperCase())}
                              className="flex-shrink-0 p-2 rounded-lg transition-colors hover:bg-[var(--color-bg)]"
                              style={{ color:"var(--color-muted)" }} title="Copy hex"
                            >
                              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <rect x="0.5" y="4" width="8" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
                                <path d="M4 4V2.5A1.5 1.5 0 015.5 1h5A1.5 1.5 0 0112 2.5v5A1.5 1.5 0 0110.5 9H9" stroke="currentColor" strokeWidth="1.2"/>
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Export extracted */}
                    <button
                      onClick={() => {
                        const css = `:root {\n${extracted.map((c,i)=>`  --color-extracted-${i+1}: ${c};`).join("\n")}\n}`;
                        copy(css, "extracted palette");
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 font-body text-[13px] font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-95 text-white"
                      style={{ background:"var(--color-accent)", boxShadow:"0 4px 12px rgba(255,61,0,0.25)" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <rect x="0.5" y="4" width="8" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M4 4V2.5A1.5 1.5 0 015.5 1h5A1.5 1.5 0 0112 2.5v5A1.5 1.5 0 0110.5 9H9" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                      Copy as CSS Variables
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}

      </div>

      <Toast msg={toast} />
    </div>
  );
}
