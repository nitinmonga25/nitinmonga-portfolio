"use client";

import { useState, useRef, useCallback, useEffect, DragEvent } from "react";
import Link from "next/link";
import { runAnalysis } from "@/lib/analyzer";
import type { AnalysisMode, AnalysisResult } from "@/lib/analyzer/types";

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const UI_ANALYZER_FAQS = [
  {
    q: "Is the UI Design Analyzer completely free?",
    a: "Yes — 100% free with no account required. Upload your screenshot, get your score, and share it. There are no hidden tiers or paywalls.",
  },
  {
    q: "What file formats are supported?",
    a: "JPG, PNG, and WebP files up to 10MB. For best results use a full-page or component screenshot at 1x or 2x resolution — avoid heavily compressed thumbnails.",
  },
  {
    q: "How is the overall score calculated?",
    a: "Seven criteria are scored independently (color, spacing, alignment, consistency, hierarchy, typography, and corner rounding) and then blended using mode-specific weights. A dashboard layout, for example, puts more weight on alignment and consistency than a poster design would.",
  },
  {
    q: "What is a good UI design score?",
    a: "90–100 is S-grade (publication ready). 80–89 is A-grade (professional quality). 70–79 is B-grade (good with minor fixes). Below 60 means there are foundational issues worth addressing before shipping.",
  },
  {
    q: "What is the difference between the four analysis modes?",
    a: "Each mode adjusts the scoring weights for what matters most in that context. Web UI weights spacing and alignment heavily. Mobile emphasises touch target spacing. Poster prioritises color and hierarchy. Dashboard focuses on alignment and information density.",
  },
  {
    q: "Can I analyze a mobile app screenshot?",
    a: "Absolutely — select the Mobile mode before uploading. The analyzer will apply weights tuned for mobile UI patterns, including tighter spacing tolerances and touch-target hierarchy.",
  },
  {
    q: "Are my uploaded images stored?",
    a: "Images are uploaded to Cloudinary for processing and a thumbnail is saved with the analysis result so you can share it. No images are sold or used for training data.",
  },
  {
    q: "How accurate is the analysis compared to a human designer?",
    a: "The tool is strong at objective, measurable signals — contrast ratios, alignment grids, spacing consistency. Subjective qualities like brand feel or emotional resonance are beyond any automated tool. Think of it as a fast second opinion, not a replacement for design review.",
  },
];

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FAQList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-2">
      {items.map(({ q, a }, i) => (
        <div key={i} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "14px" }}>
          <button
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-body text-[14px] font-semibold text-[var(--color-ink)]">{q}</span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
              className="flex-shrink-0 transition-transform duration-200"
              style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)", color: "var(--color-accent)" }}
            >
              <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {open === i && (
            <div className="px-5 pb-4">
              <p className="font-body text-[13px] text-[var(--color-muted)] leading-relaxed">{a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODES: { id: AnalysisMode; label: string; icon: string }[] = [
  { id: "web_ui",    label: "Web UI",    icon: "M2 4h20v14H2zM8 22h8M12 18v4" },
  { id: "mobile",   label: "Mobile",    icon: "M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zM12 18h.01" },
  { id: "poster",   label: "Poster",    icon: "M4 2h16v20H4zM8 7h8M8 11h8M8 15h5" },
  { id: "dashboard",label: "Dashboard", icon: "M2 2h9v9H2zM13 2h9v9h-9zM2 13h9v9H2zM13 13h9v9h-9z" },
];

const CRITERIA: { key: keyof AnalysisResult & string; label: string; conf: string }[] = [
  { key: "color",       label: "Color Usage",   conf: "High"   },
  { key: "spacing",     label: "Spacing",       conf: "High"   },
  { key: "alignment",   label: "Alignment",     conf: "High"   },
  { key: "consistency", label: "Consistency",   conf: "High"   },
  { key: "radius",      label: "Corner Rounding", conf: "Medium" },
  { key: "hierarchy",   label: "Hierarchy",     conf: "Medium" },
  { key: "typography",  label: "Typography",    conf: "Medium" },
];

function barColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function confColor(conf: string) {
  if (conf === "High")   return { bg: "rgba(34,197,94,0.12)",  color: "#16a34a" };
  if (conf === "Medium") return { bg: "rgba(245,158,11,0.12)", color: "#d97706" };
  return { bg: "rgba(239,68,68,0.12)", color: "#dc2626" };
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedScore({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const dur = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{val}</>;
}

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score, delay }: { score: number; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(t);
  }, [score, delay]);
  return (
    <div className="relative h-2 rounded-full overflow-hidden flex-1" style={{ background: "var(--color-bg)" }}>
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%`, background: barColor(score) }}
      />
    </div>
  );
}

// ─── Scanning Animation ───────────────────────────────────────────────────────

function ScanningOverlay({ preview, step }: { preview: string; step: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(92, Math.round((elapsed / 9000) * 92)));
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const SCAN_STEPS = ["Uploading image…", "Extracting color palette…", "Detecting layout shapes…", "Computing hierarchy…", "Analysing typography…", "Computing final score…"];
  const [fakeStep, setFakeStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFakeStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1)), 1400);
    return () => clearInterval(t);
  }, []);

  const displayStep = step || SCAN_STEPS[fakeStep];

  return (
    <div className="mb-6">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--color-border)", background: "#000", minHeight: 320 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Analyzing"
          className="w-full object-contain"
          style={{ maxHeight: 480, display: "block", opacity: 0.55 }}
        />

        {/* Corner brackets */}
        {(["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"] as const).map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-7 h-7 scan-dot`}
            style={{
              borderTop:    i < 2  ? "2px solid #FF3D00" : undefined,
              borderBottom: i >= 2 ? "2px solid #FF3D00" : undefined,
              borderLeft:   i % 2 === 0 ? "2px solid #FF3D00" : undefined,
              borderRight:  i % 2 === 1 ? "2px solid #FF3D00" : undefined,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}

        {/* Scan line */}
        <div className="scan-line" />

        {/* Grid dots overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,61,0,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Bottom status bar */}
        <div
          className="absolute bottom-0 inset-x-0 px-5 py-4"
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full scan-dot" style={{ background: "#FF3D00", display: "inline-block" }} />
              <p className="font-mono text-[11px] text-white/70 uppercase tracking-widest truncate">{displayStep}</p>
            </div>
            <p className="font-mono text-[12px] font-bold flex-shrink-0" style={{ color: "#FF3D00" }}>{progress}%</p>
          </div>
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #FF3D00, #ff7043)" }}
            />
          </div>
        </div>
      </div>

      {/* Step labels below */}
      <div className="flex justify-center flex-wrap gap-2 mt-4">
        {SCAN_STEPS.map((s, i) => (
          <span
            key={i}
            className="font-mono text-[10px] px-2 py-0.5 rounded-full transition-all duration-300"
            style={{
              background: i <= fakeStep ? "rgba(255,61,0,0.12)" : "var(--color-surface)",
              color:      i <= fakeStep ? "#FF3D00"              : "var(--color-muted)",
              border:     `1px solid ${i <= fakeStep ? "rgba(255,61,0,0.25)" : "var(--color-border)"}`,
            }}
          >
            {i <= fakeStep ? "✓" : `${i + 1}`} {s.replace("…", "")}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Share PNG ────────────────────────────────────────────────────────────────

function generateShareCard(result: AnalysisResult): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1200; canvas.height = 630;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#F5F3EF";
  ctx.fillRect(0, 0, 1200, 630);

  ctx.beginPath();
  ctx.arc(200, 315, 130, 0, Math.PI * 2);
  ctx.fillStyle = "#111111";
  ctx.fill();

  ctx.fillStyle = "#C9A84C";
  ctx.font = "bold 88px serif";
  ctx.textAlign = "center";
  ctx.fillText(result.totalScore.toString(), 200, 340);
  ctx.fillStyle = "#F5F3EF";
  ctx.font = "24px sans-serif";
  ctx.fillText("/100", 200, 374);
  ctx.fillStyle = "#FF3D00";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText(result.grade, 200, 420);

  const labels = ["Color", "Spacing", "Alignment", "Consistency", "Hierarchy", "Typography"];
  const keys: (keyof AnalysisResult)[] = ["color","spacing","alignment","consistency","hierarchy","typography"];
  labels.forEach((label, i) => {
    const y = 60 + i * 88;
    const score = result[keys[i]] as number;
    ctx.fillStyle = "#111";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label, 380, y);
    ctx.fillStyle = "#E8E4DE";
    ctx.beginPath();
    (ctx as CanvasRenderingContext2D & { roundRect: (x:number,y:number,w:number,h:number,r:number) => void }).roundRect(380, y + 10, 700, 16, 8);
    ctx.fill();
    ctx.fillStyle = barColor(score);
    ctx.beginPath();
    (ctx as CanvasRenderingContext2D & { roundRect: (x:number,y:number,w:number,h:number,r:number) => void }).roundRect(380, y + 10, score * 7, 16, 8);
    ctx.fill();
    ctx.fillStyle = "#555";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(String(score), 1100, y);
  });

  ctx.fillStyle = "#9CA3AF";
  ctx.font = "18px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("nitinmonga.in/tools/ui-analyzer", 1160, 610);
  return canvas.toDataURL("image/png");
}

// ─── Results Card ─────────────────────────────────────────────────────────────

function ResultsCard({ result, uuid }: { result: AnalysisResult; uuid: string | null }) {
  function downloadShare() {
    const url = generateShareCard(result);
    const a = document.createElement("a");
    a.href = url; a.download = "ui-score.png"; a.click();
  }

  const gradeColors: Record<string, string> = {
    S: "#C9A84C", A: "#22c55e", B: "#3b82f6", C: "#f59e0b", D: "#f97316", F: "#ef4444",
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Score Header */}
      <div
        className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 rounded-2xl"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex-shrink-0 w-24 h-24 rounded-full flex flex-col items-center justify-center" style={{ background: "#111", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
          <span className="font-display font-bold text-4xl" style={{ color: "#C9A84C", lineHeight: 1 }}>
            <AnimatedScore target={result.totalScore} />
          </span>
          <span className="font-body text-[11px] text-white/50 mt-0.5">/100</span>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <span className="font-display text-5xl font-black" style={{ color: gradeColors[result.grade] ?? "#888" }}>
              {result.grade}
            </span>
            <div>
              <p className="font-display text-[15px] font-bold text-[var(--color-ink)]">{result.gradeLabel}</p>
              <p className="font-body text-[12px] text-[var(--color-muted)]">
                {result.mode.replace("_", " ").toUpperCase()} · {result.processingMs}ms
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-center">
          <button
            onClick={downloadShare}
            className="flex items-center gap-1.5 px-3 py-2 font-body text-[12px] font-semibold rounded-xl transition-all hover:scale-105 text-white"
            style={{ background: "var(--color-accent)", boxShadow: "0 4px 12px rgba(255,61,0,0.25)" }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v8M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Share Card
          </button>
        </div>
      </div>

      {/* Criterion Bars */}
      <div
        className="p-5 sm:p-6 rounded-2xl"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
      >
        <p className="section-label mb-4">// Breakdown</p>
        <div className="flex flex-col gap-3.5">
          {CRITERIA.map(({ key, label, conf }, i) => {
            const score = result[key as keyof AnalysisResult] as number;
            const cc = confColor(conf);
            return (
              <div key={key} className="flex items-center gap-3">
                <div className="w-28 flex-shrink-0">
                  <p className="font-body text-[13px] font-semibold text-[var(--color-ink)]">{label}</p>
                </div>
                <ScoreBar score={score} delay={500 + i * 100} />
                <div className="w-10 text-right flex-shrink-0">
                  <span className="font-mono text-[13px] font-bold" style={{ color: barColor(score) }}>{score}</span>
                </div>
                <div className="hidden sm:block w-16 flex-shrink-0">
                  <span className="font-body text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={cc}>{conf}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Feedback */}
      <div
        className="p-5 sm:p-6 rounded-2xl"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
      >
        <p className="section-label mb-4">// Detailed Feedback</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {CRITERIA.map(({ key, label }) => {
            const items = result.feedbackMap[key as keyof typeof result.feedbackMap] ?? [];
            const score = result[key as keyof AnalysisResult] as number;
            return (
              <div key={key} className="p-4 rounded-xl" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-[12px] font-bold uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
                  <span className="font-mono text-[12px] font-bold" style={{ color: barColor(score) }}>{score}/100</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: barColor(score) }} />
                      <p className="font-body text-[12px] text-[var(--color-muted)] leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Improvements */}
      {result.improvements.length > 0 && (
        <div
          className="p-5 sm:p-6 rounded-2xl"
          style={{ background: "rgba(255,61,0,0.04)", border: "1px solid rgba(255,61,0,0.15)" }}
        >
          <p className="section-label mb-4">// Top Improvements</p>
          <div className="flex flex-col gap-3">
            {result.improvements.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full font-display text-[11px] font-bold text-white flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
                  {i + 1}
                </span>
                <p className="font-body text-[13px] text-[var(--color-ink)] leading-relaxed pt-0.5">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UIAnalyzerClient({ initialResult, initialUuid }: {
  initialResult?: AnalysisResult | null;
  initialUuid?: string | null;
}) {
  const [mode,      setMode]      = useState<AnalysisMode>("web_ui");
  const [dragOver,  setDragOver]  = useState(false);
  const [file,      setFile]      = useState<File | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [step,      setStep]      = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result,    setResult]    = useState<AnalysisResult | null>(initialResult ?? null);
  const [uuid,      setUuid]      = useState<string | null>(initialUuid ?? null);
  const [error,     setError]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Silently preload OpenCV.js as soon as a file is selected — it may be ready by analysis time
  useEffect(() => {
    if (!file || typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.cv || w.cvLoading) return;
    w.cvLoading = true;
    const s = document.createElement("script");
    s.src = "https://docs.opencv.org/4.8.0/opencv.js";
    s.async = true;
    document.body.appendChild(s);
  }, [file]);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) { setError("Please upload an image file (JPG, PNG, or WebP)."); return; }
    if (f.size > 10 * 1024 * 1024)   { setError("File too large. Maximum size is 10MB."); return; }
    setFile(f);
    setError("");
    setResult(null);
    setUuid(null);
    setPreview(URL.createObjectURL(f));
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  const analyze = useCallback(async () => {
    if (!file) return;
    setAnalyzing(true); setError(""); setResult(null); setUuid(null);
    try {
      setStep("Uploading & preprocessing…");
      const form = new FormData();
      form.append("file", file);
      form.append("mode", mode);
      const uploadRes = await fetch("/api/analyze-ui", { method: "POST", body: form });
      const upload = await uploadRes.json() as {
        ok: boolean; error?: string; message?: string;
        base64: string; imageUrl: string; ipHash: string;
        width: number; height: number; entropy: number; luminance: number; contrast: number; blurScore: number;
      };
      if (!upload.ok) {
        if (uploadRes.status === 429) throw new Error(upload.message ?? "Rate limit reached.");
        throw new Error(upload.error ?? "Upload failed.");
      }

      setStep("Running analysis…");
      const analysis = await runAnalysis(upload, mode, setStep);

      setStep("Saving results…");
      const saveRes = await fetch("/api/analyze-ui/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl:         upload.imageUrl,
          mode,
          ipHash:           upload.ipHash,
          totalScore:       analysis.totalScore,
          colorScore:       analysis.color,
          spacingScore:     analysis.spacing,
          alignmentScore:   analysis.alignment,
          consistencyScore: analysis.consistency,
          radiusScore:      analysis.radius,
          hierarchyScore:   analysis.hierarchy,
          typographyScore:  analysis.typography,
          feedbackMap:      analysis.feedbackMap,
          improvements:     analysis.improvements,
          palette:          analysis.palette,
        }),
      });
      const saved = await saveRes.json() as { ok: boolean; uuid?: string };
      if (saved.ok && saved.uuid) setUuid(saved.uuid);

      setResult(analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false); setStep("");
    }
  }, [file, mode]);

  function reset() {
    setResult(null); setFile(null); setPreview(null); setUuid(null); setError("");
  }

  const showForm    = !analyzing && !result;
  const showScan    = analyzing && !!preview;
  const showResults = !!result;

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-28 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/tools/" className="inline-flex items-center gap-1.5 font-body text-[13px] text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors group">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Tools
          </Link>
          <span style={{ color: "var(--color-border)" }}>/</span>
          <span className="font-body text-[13px] text-[var(--color-ink)]">UI Analyzer</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <p className="section-label mb-3">// Design Tools</p>
          <h1 className="font-display font-bold text-[var(--color-ink)] leading-tight mb-3" style={{ fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.025em" }}>
            UI Design<br /><span className="text-[var(--color-accent)]">Analyzer</span>
          </h1>
          <p className="font-body text-[var(--color-muted)] max-w-[480px] leading-relaxed text-[14px] sm:text-[15px]">
            Upload any UI screenshot and get a professional scored analysis across 7 design criteria — free, instant, no login.
          </p>
        </div>

        {/* ── Upload / Mode / Button form ─────────────────────────────────── */}
        {showForm && (
          <>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="relative rounded-2xl cursor-pointer transition-all duration-200 mb-5 overflow-hidden"
              style={{
                minHeight: 240,
                border: `2px dashed ${dragOver ? "var(--color-accent)" : "var(--color-border)"}`,
                background: dragOver ? "rgba(255,61,0,0.04)" : "var(--color-surface)",
              }}
            >
              {preview ? (
                <div className="relative w-full h-full flex items-center justify-center p-4" style={{ minHeight: 240 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="max-h-72 max-w-full object-contain rounded-xl" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 rounded-2xl">
                    <p className="font-body text-white text-sm font-semibold">Click to change image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 p-10" style={{ minHeight: 240 }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <rect x="2" y="4" width="24" height="18" rx="3" stroke="var(--color-muted)" strokeWidth="1.6"/>
                      <circle cx="9" cy="11" r="2.5" stroke="var(--color-muted)" strokeWidth="1.4"/>
                      <path d="M2 18l6-5 5 4 4-3 9 8" stroke="var(--color-muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-[16px] font-bold text-[var(--color-ink)] mb-1">Drop a UI screenshot here</p>
                    <p className="font-body text-[13px] text-[var(--color-muted)]">or click to browse · JPG, PNG, WebP · max 10MB</p>
                  </div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>

            <div className="mb-5">
              <p className="font-body text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-muted)] mb-3">Analysis Mode</p>
              <div className="flex flex-wrap gap-2">
                {MODES.map(({ id, label, icon }) => (
                  <button key={id} onClick={() => setMode(id)}
                    className="flex items-center gap-2 px-3.5 py-2 font-body text-[13px] font-medium rounded-xl transition-all duration-150"
                    style={{
                      background: mode === id ? "var(--color-accent)"  : "var(--color-surface)",
                      color:      mode === id ? "#fff"                  : "var(--color-muted)",
                      border:    `1px solid ${mode === id ? "var(--color-accent)" : "var(--color-border)"}`,
                      fontWeight: mode === id ? 600 : 400,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d={icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.4"/><path d="M7 4v3M7 9.5v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <p className="font-body text-[13px] text-red-500">{error}</p>
              </div>
            )}

            <button
              onClick={analyze}
              disabled={!file}
              className="w-full flex items-center justify-center gap-3 py-3.5 font-display text-[15px] font-bold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] text-white"
              style={{ background: "var(--color-accent)", boxShadow: "0 6px 20px rgba(255,61,0,0.3)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {file ? "Analyze Design" : "Upload an image to analyze"}
            </button>
          </>
        )}

        {/* ── Scanning animation ──────────────────────────────────────────── */}
        {showScan && <ScanningOverlay preview={preview!} step={step} />}

        {/* ── How Scoring Works ───────────────────────────────────────────── */}
        {showForm && (
          <div className="mt-16">
            <p className="section-label mb-3">// How It Works</p>
            <h2 className="font-display font-bold text-[var(--color-ink)] text-[22px] mb-6">What the analyzer checks</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Color Usage", score: "15%", desc: "Evaluates palette harmony, WCAG contrast ratios, and whether colors are over-used or under-used across the design." },
                { label: "Spacing",     score: "18%", desc: "Checks padding, margin consistency, and breathing room between elements — tight spacing is one of the most common UI mistakes." },
                { label: "Alignment",   score: "18%", desc: "Detects misaligned elements, off-grid layouts, and inconsistent edge margins that break visual order." },
                { label: "Consistency", score: "15%", desc: "Measures whether corner radii, font sizes, and spacing values follow a consistent system throughout." },
                { label: "Hierarchy",   score: "14%", desc: "Assesses whether the design clearly guides the eye — primary, secondary, and tertiary information should each have distinct visual weight." },
                { label: "Typography",  score: "12%", desc: "Looks at font-size variety, line-height, and whether text scales are logical (e.g., a proper heading/body ratio)." },
                { label: "Corner Rounding", score: "8%", desc: "Checks that border-radius values are consistent and appropriate for the design style — mixing sharp and pill shapes reads as unpolished." },
              ].map(({ label, score, desc }) => (
                <div key={label} className="p-4 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body text-[13px] font-bold text-[var(--color-ink)]">{label}</p>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,61,0,0.1)", color: "#FF3D00" }}>{score} weight</span>
                  </div>
                  <p className="font-body text-[12px] text-[var(--color-muted)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        {showForm && (
          <div className="mt-16">
            <p className="section-label mb-3">// FAQ</p>
            <h2 className="font-display font-bold text-[var(--color-ink)] text-[22px] mb-6">Frequently asked questions</h2>
            <FAQList items={UI_ANALYZER_FAQS} />
          </div>
        )}

        {/* ── Results: 2-column layout ────────────────────────────────────── */}
        {showResults && preview && (
          <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-8 lg:items-start">

            {/* Left: sticky image + palette */}
            <div className="lg:sticky lg:top-28 space-y-4 mb-6 lg:mb-0">
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Analyzed design" className="w-full object-contain block" style={{ maxHeight: 480 }} />
              </div>

              {/* Palette card */}
              <div className="p-4 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                <p className="section-label mb-3">// Color Palette</p>
                <div className="flex flex-wrap gap-2">
                  {result.palette.map((hex, i) => (
                    <div key={i} title={hex} className="group relative">
                      <div className="w-9 h-9 rounded-lg" style={{ background: hex }} />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analyze another button */}
              <button
                onClick={reset}
                className="w-full py-2.5 font-body text-[13px] font-semibold rounded-xl transition-all hover:scale-[1.01]"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
              >
                ← Analyze another design
              </button>
            </div>

            {/* Right: all result cards */}
            <div>
              <ResultsCard result={result} uuid={uuid} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
