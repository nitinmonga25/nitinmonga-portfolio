"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type QRType = "url" | "wifi" | "whatsapp" | "upi" | "instagram" | "google_review" | "vcard" | "email";
type DotStyle = "square" | "dots" | "rounded" | "extra-rounded" | "classy";
type CornerStyle = "square" | "dot" | "extra-rounded";
type MockupView = "none" | "card" | "phone" | "poster" | "stand";

interface Preset {
  label: string;
  fg: string;
  bg: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  gradient?: [string, string];
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: Record<string, Preset> = {
  minimal:  { label: "Minimal",     fg: "#000000", bg: "#FFFFFF", dotStyle: "square",        cornerStyle: "square"        },
  luxury:   { label: "Luxury",      fg: "#C9A84C", bg: "#1A1A1A", dotStyle: "rounded",       cornerStyle: "extra-rounded" },
  neon:     { label: "Neon",        fg: "#00FF88", bg: "#0A0A0A", dotStyle: "dots",           cornerStyle: "extra-rounded" },
  tech:     { label: "Tech",        fg: "#0EA5E9", bg: "#0F172A", dotStyle: "classy",         cornerStyle: "square"        },
  gradient: { label: "Gradient",    fg: "#FF3D00", bg: "#FFFFFF", dotStyle: "rounded",        cornerStyle: "extra-rounded", gradient: ["#FF3D00", "#FF8C00"] },
  glass:    { label: "Glassmorphism",fg: "#6366F1", bg: "#F0F4FF", dotStyle: "dots",          cornerStyle: "extra-rounded", gradient: ["#6366F1", "#8B5CF6"] },
  modern:   { label: "Modern Biz",  fg: "#1D4ED8", bg: "#EFF6FF", dotStyle: "rounded",        cornerStyle: "extra-rounded", gradient: ["#1D4ED8", "#7C3AED"] },
};

// ─── QR Type Config ───────────────────────────────────────────────────────────

const QR_TYPES: { id: QRType; label: string; icon: string }[] = [
  { id: "url",           label: "Website",       icon: "🌐" },
  { id: "whatsapp",      label: "WhatsApp",      icon: "💬" },
  { id: "wifi",          label: "WiFi",          icon: "📶" },
  { id: "upi",           label: "UPI Pay",       icon: "💳" },
  { id: "instagram",     label: "Instagram",     icon: "📸" },
  { id: "google_review", label: "Google Review", icon: "⭐" },
  { id: "vcard",         label: "Business Card", icon: "👤" },
  { id: "email",         label: "Email",         icon: "✉️"  },
];

// ─── Data builder ─────────────────────────────────────────────────────────────

function buildData(type: QRType, f: Record<string, string>): string {
  switch (type) {
    case "url":
      return f.url || "https://nitinmonga.in";
    case "wifi":
      return `WIFI:T:${f.security || "WPA"};S:${f.ssid || "MyNetwork"};P:${f.password || ""};;`;
    case "whatsapp": {
      const ph = (f.phone || "919999999999").replace(/\D/g, "");
      return `https://wa.me/${ph}${f.message ? `?text=${encodeURIComponent(f.message)}` : ""}`;
    }
    case "upi":
      return `upi://pay?pa=${f.vpa || "example@upi"}&pn=${encodeURIComponent(f.name || "")}&am=${f.amount || ""}&cu=INR`;
    case "instagram":
      return `https://instagram.com/${f.username || "nitinmonga25"}`;
    case "google_review":
      return `https://search.google.com/local/writereview?placeid=${f.placeid || "ChIJ..."}`;
    case "vcard":
      return [
        "BEGIN:VCARD", "VERSION:3.0",
        `FN:${f.name || "Your Name"}`,
        f.phone   ? `TEL:${f.phone}`   : "",
        f.email   ? `EMAIL:${f.email}` : "",
        f.company ? `ORG:${f.company}` : "",
        f.website ? `URL:${f.website}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    case "email":
      return `mailto:${f.email || "hello@example.com"}${f.subject ? `?subject=${encodeURIComponent(f.subject)}` : ""}${f.body ? `&body=${encodeURIComponent(f.body)}` : ""}`;
    default:
      return "https://nitinmonga.in";
  }
}

// ─── Canvas renderer ──────────────────────────────────────────────────────────

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function isInFinder(r: number, c: number, size: number): boolean {
  // Top-left, top-right, bottom-left finder patterns (7×7)
  return (r < 7 && c < 7) || (r < 7 && c > size - 8) || (r > size - 8 && c < 7);
}

function isInAlignment(r: number, c: number, size: number): boolean {
  // Alignment pattern center for versions >1 (roughly at size-7)
  if (size < 25) return false;
  const ap = size - 7;
  return Math.abs(r - ap) <= 2 && Math.abs(c - ap) <= 2;
}

function drawFinder(
  ctx: CanvasRenderingContext2D,
  originR: number, originC: number,
  cellSize: number, pad: number,
  fg: string, bg: string,
  cornerStyle: CornerStyle,
) {
  const x = (originC + pad) * cellSize;
  const y = (originR + pad) * cellSize;
  const cs7 = cellSize * 7;
  const cs5 = cellSize * 5;
  const cs3 = cellSize * 3;

  const r7 = cornerStyle === "extra-rounded" ? cellSize * 1.2 : cornerStyle === "dot" ? cs7 / 2 : 0;
  const r5 = 0; // inner ring always square gap
  const r3 = cornerStyle === "extra-rounded" ? cellSize * 0.8 : cornerStyle === "dot" ? cs3 / 2 : 0;

  // Outer square (7×7)
  ctx.fillStyle = fg;
  if (cornerStyle === "dot") {
    ctx.beginPath(); ctx.arc(x + cs7 / 2, y + cs7 / 2, cs7 / 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(x + cs7 / 2, y + cs7 / 2, cs5 / 2, 0, Math.PI * 2); ctx.fill();
  } else {
    roundedRect(ctx, x, y, cs7, cs7, r7); ctx.fill();
    ctx.fillStyle = bg;
    roundedRect(ctx, x + cellSize, y + cellSize, cs5, cs5, r5); ctx.fill();
  }

  // Inner dot (3×3)
  ctx.fillStyle = fg;
  if (cornerStyle === "dot") {
    ctx.beginPath(); ctx.arc(x + cs7 / 2, y + cs7 / 2, cs3 / 2, 0, Math.PI * 2); ctx.fill();
  } else {
    roundedRect(ctx, x + cellSize * 2, y + cellSize * 2, cs3, cs3, r3); ctx.fill();
  }
}

async function renderQR(
  canvas: HTMLCanvasElement,
  data: string,
  preset: Preset,
  logoUrl: string | null,
  size = 1000,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const QRCode = (await import("qrcode")) as any;
  const qr = QRCode.create(data, { errorCorrectionLevel: "H" });
  const modules: boolean[] = Array.from(qr.modules.data as Uint8Array).map(Boolean);
  const mSize: number = qr.modules.size;

  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const PAD = 3; // quiet zone in modules
  const cell = size / (mSize + PAD * 2);

  // Background
  ctx.fillStyle = preset.bg;
  ctx.fillRect(0, 0, size, size);

  // Build fill style (gradient or solid)
  let fillStyle: string | CanvasGradient = preset.fg;
  if (preset.gradient) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, preset.gradient[0]);
    grad.addColorStop(1, preset.gradient[1]);
    fillStyle = grad;
  }
  ctx.fillStyle = fillStyle;

  // Draw data modules
  for (let r = 0; r < mSize; r++) {
    for (let c = 0; c < mSize; c++) {
      if (!modules[r * mSize + c]) continue;
      if (isInFinder(r, c, mSize)) continue;
      if (isInAlignment(r, c, mSize)) continue;

      const x = (c + PAD) * cell;
      const y = (r + PAD) * cell;

      switch (preset.dotStyle) {
        case "square":
          ctx.fillRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
          break;
        case "dots":
          ctx.beginPath();
          ctx.arc(x + cell / 2, y + cell / 2, cell * 0.44, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "rounded":
          roundedRect(ctx, x + 0.5, y + 0.5, cell - 1, cell - 1, cell * 0.3);
          ctx.fill();
          break;
        case "extra-rounded":
          roundedRect(ctx, x + 0.5, y + 0.5, cell - 1, cell - 1, cell * 0.45);
          ctx.fill();
          break;
        case "classy": {
          // Only round corners that don't touch a neighbour
          const top    = r > 0           && modules[(r - 1) * mSize + c];
          const bottom = r < mSize - 1   && modules[(r + 1) * mSize + c];
          const left   = c > 0           && modules[r * mSize + (c - 1)];
          const right  = c < mSize - 1   && modules[r * mSize + (c + 1)];
          const radius = cell * 0.35;
          ctx.beginPath();
          ctx.moveTo(x + (left  ? 0 : radius), y);
          ctx.lineTo(x + cell - (right ? 0 : radius), y);
          if (!right) ctx.arcTo(x + cell, y, x + cell, y + radius, radius);
          ctx.lineTo(x + cell, y + cell - (bottom ? 0 : radius));
          if (!bottom) ctx.arcTo(x + cell, y + cell, x + cell - radius, y + cell, radius);
          ctx.lineTo(x + (left ? 0 : radius), y + cell);
          if (!left) ctx.arcTo(x, y + cell, x, y + cell - radius, radius);
          ctx.lineTo(x, y + (top ? 0 : radius));
          if (!top) ctx.arcTo(x, y, x + radius, y, radius);
          ctx.closePath();
          ctx.fill();
          break;
        }
      }
    }
  }

  // Draw alignment pattern
  if (mSize >= 25) {
    const ap = mSize - 7;
    for (let r = ap - 2; r <= ap + 2; r++) {
      for (let c = ap - 2; c <= ap + 2; c++) {
        if (!modules[r * mSize + c]) continue;
        const x = (c + PAD) * cell;
        const y = (r + PAD) * cell;
        roundedRect(ctx, x + 0.5, y + 0.5, cell - 1, cell - 1, cell * 0.2);
        ctx.fill();
      }
    }
  }

  // Draw finder patterns
  ctx.fillStyle = fillStyle;
  drawFinder(ctx, 0,          0,          cell, PAD, preset.fg, preset.bg, preset.cornerStyle);
  drawFinder(ctx, 0,          mSize - 7,  cell, PAD, preset.fg, preset.bg, preset.cornerStyle);
  drawFinder(ctx, mSize - 7,  0,          cell, PAD, preset.fg, preset.bg, preset.cornerStyle);

  // Draw logo
  if (logoUrl) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const logoSize = size * 0.18;
        const lx = (size - logoSize) / 2;
        const ly = (size - logoSize) / 2;
        // White padding behind logo
        ctx.fillStyle = preset.bg;
        roundedRect(ctx, lx - 6, ly - 6, logoSize + 12, logoSize + 12, 8);
        ctx.fill();
        ctx.drawImage(img, lx, ly, logoSize, logoSize);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = logoUrl;
    });
  }
}

// ─── Contrast checker ─────────────────────────────────────────────────────────

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (v: number) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const bright = Math.max(l1, l2);
  const dark   = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

// ─── Field components ─────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  background: "var(--color-surface)",
  border:     "1px solid var(--color-border)",
  borderRadius: "10px",
  color: "var(--color-ink)",
  padding: "10px 14px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
  fontFamily: "var(--font-body)",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>{label}</label>
      {children}
    </div>
  );
}

// ─── Form panels ──────────────────────────────────────────────────────────────

function FormPanel({ type, form, set }: { type: QRType; form: Record<string, string>; set: (k: string, v: string) => void }) {
  const inp = (key: string, placeholder: string, inputType = "text") => (
    <input
      type={inputType}
      value={form[key] || ""}
      placeholder={placeholder}
      onChange={(e) => set(key, e.target.value)}
      style={INPUT_STYLE}
    />
  );

  switch (type) {
    case "url":
      return <Field label="Website URL">{inp("url", "https://yoursite.com", "url")}</Field>;

    case "wifi":
      return (
        <>
          <Field label="Network Name (SSID)">{inp("ssid", "MyHomeWifi")}</Field>
          <Field label="Password">{inp("password", "password123")}</Field>
          <Field label="Security Type">
            <select value={form.security || "WPA"} onChange={(e) => set("security", e.target.value)} style={INPUT_STYLE}>
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None (Open)</option>
            </select>
          </Field>
        </>
      );

    case "whatsapp":
      return (
        <>
          <Field label="Phone Number (with country code)">{inp("phone", "919876543210", "tel")}</Field>
          <Field label="Pre-filled Message (optional)">
            <textarea value={form.message || ""} placeholder="Hi, I'd like to enquire about…" onChange={(e) => set("message", e.target.value)} rows={3} style={{ ...INPUT_STYLE, resize: "vertical" }} />
          </Field>
        </>
      );

    case "upi":
      return (
        <>
          <Field label="UPI ID / VPA">{inp("vpa", "yourname@upi")}</Field>
          <Field label="Payee Name">{inp("name", "Your Business")}</Field>
          <Field label="Amount (optional)">{inp("amount", "0.00", "number")}</Field>
        </>
      );

    case "instagram":
      return <Field label="Instagram Username">{inp("username", "your_username")}</Field>;

    case "google_review":
      return (
        <>
          <Field label="Google Place ID">
            <input type="text" value={form.placeid || ""} placeholder="ChIJxxxxxxxxxxxxxxxx" onChange={(e) => set("placeid", e.target.value)} style={INPUT_STYLE} />
          </Field>
          <p className="font-body text-[11px]" style={{ color: "var(--color-muted)" }}>
            Find your Place ID at <span style={{ color: "var(--color-accent)" }}>developers.google.com/maps/documentation/places/web-service/place-id</span>
          </p>
        </>
      );

    case "vcard":
      return (
        <>
          <Field label="Full Name">{inp("name", "Nitin Monga")}</Field>
          <Field label="Phone">{inp("phone", "+91 98765 43210", "tel")}</Field>
          <Field label="Email">{inp("email", "hello@example.com", "email")}</Field>
          <Field label="Company">{inp("company", "Xdecoders")}</Field>
          <Field label="Website">{inp("website", "https://nitinmonga.in", "url")}</Field>
        </>
      );

    case "email":
      return (
        <>
          <Field label="Email Address">{inp("email", "hello@example.com", "email")}</Field>
          <Field label="Subject (optional)">{inp("subject", "Enquiry")}</Field>
          <Field label="Body (optional)">
            <textarea value={form.body || ""} placeholder="Hi Nitin…" onChange={(e) => set("body", e.target.value)} rows={3} style={{ ...INPUT_STYLE, resize: "vertical" }} />
          </Field>
        </>
      );

    default:
      return null;
  }
}

// ─── Mockups ──────────────────────────────────────────────────────────────────

function Mockup({ view, previewSrc, preset }: { view: MockupView; previewSrc: string; preset: Preset }) {
  const qrImg = <img src={previewSrc} alt="QR preview" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />;

  if (view === "card") return (
    <div style={{ width: 340, height: 200, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", borderRadius: 16, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", flexShrink: 0, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,61,0,0.15)" }} />
      <div>
        <div style={{ width: 40, height: 4, background: "#FF3D00", borderRadius: 2, marginBottom: 10 }} />
        <p style={{ color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, margin: 0 }}>Your Brand</p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)", fontSize: 11, margin: "4px 0 0" }}>yourwebsite.com</p>
      </div>
      <div style={{ width: 72, height: 72, padding: 4, background: "#fff", borderRadius: 10 }}>
        {qrImg}
      </div>
    </div>
  );

  if (view === "phone") return (
    <div style={{ width: 160, height: 320, background: "#111", borderRadius: 28, padding: "10px 6px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: 40, height: 6, background: "#333", borderRadius: 3 }} />
      <div style={{ background: "#fff", borderRadius: 22, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 16 }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 9, color: "#666", margin: 0, textAlign: "center" }}>Scan to visit</p>
        <div style={{ width: 100, height: 100 }}>{qrImg}</div>
        <div style={{ width: 40, height: 3, background: preset.fg, borderRadius: 2 }} />
        <p style={{ fontFamily: "var(--font-body)", fontSize: 8, color: "#999", margin: 0 }}>nitinmonga.in</p>
      </div>
    </div>
  );

  if (view === "poster") return (
    <div style={{ width: 200, height: 280, background: "linear-gradient(160deg, #0f0f0f 0%, #1a1a1a 100%)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", flexShrink: 0 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 30, height: 2, background: "#FF3D00", margin: "0 auto 8px" }} />
        <p style={{ color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, margin: 0 }}>SCAN ME</p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)", fontSize: 9, margin: "4px 0 0" }}>to learn more</p>
      </div>
      <div style={{ width: 120, height: 120, padding: 6, background: "#fff", borderRadius: 10 }}>
        {qrImg}
      </div>
      <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-body)", fontSize: 8, margin: 0, textAlign: "center" }}>nitinmonga.in</p>
    </div>
  );

  if (view === "stand") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
      {/* Tent card */}
      <div style={{ width: 220, background: "#fff", borderRadius: "12px 12px 0 0", padding: "20px 20px 16px", boxShadow: "0 -4px 20px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "#111", margin: 0 }}>Table {"{"}7{"}"}</p>
        <div style={{ width: 110, height: 110, padding: 5, border: `2px solid ${preset.fg}`, borderRadius: 8 }}>
          {qrImg}
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 9, color: "#666", margin: 0, textAlign: "center" }}>Scan to view menu</p>
      </div>
      {/* Stand base */}
      <div style={{ width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: "16px solid #e5e5e5" }} />
      <div style={{ width: 60, height: 4, background: "#ccc", borderRadius: 2 }} />
    </div>
  );

  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function QRStudioClient() {
  const [qrType,   setQrType]   = useState<QRType>("url");
  const [form,     setForm]     = useState<Record<string, string>>({ url: "https://nitinmonga.in" });
  const [preset,   setPreset]   = useState<Preset>(PRESETS.minimal);
  const [fgColor,  setFgColor]  = useState("#000000");
  const [bgColor,  setBgColor]  = useState("#FFFFFF");
  const [dotStyle, setDotStyle] = useState<DotStyle>("square");
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>("square");
  const [logoUrl,  setLogoUrl]  = useState<string | null>(null);
  const [mockup,   setMockup]   = useState<MockupView>("none");
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [rendering,  setRendering]  = useState(false);
  const [lowContrast, setLowContrast] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePreset: Preset = { ...preset, fg: fgColor, bg: bgColor, dotStyle, cornerStyle };

  const regenerate = useCallback(async () => {
    if (!canvasRef.current) return;
    const data = buildData(qrType, form);
    setLowContrast(contrast(fgColor, bgColor) < 3);
    setRendering(true);
    try {
      await renderQR(canvasRef.current, data, activePreset, logoUrl);
      setPreviewSrc(canvasRef.current.toDataURL("image/png"));
    } catch (e) {
      console.error("QR render failed", e);
    } finally {
      setRendering(false);
    }
  }, [qrType, form, activePreset, logoUrl, fgColor, bgColor]);

  // Debounce regeneration to avoid thrashing while typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(regenerate, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [regenerate]);

  function applyPreset(p: Preset) {
    setPreset(p);
    setFgColor(p.fg);
    setBgColor(p.bg);
    setDotStyle(p.dotStyle);
    setCornerStyle(p.cornerStyle);
  }

  function setField(k: string, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function switchType(t: QRType) {
    setQrType(t);
    setForm({});
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function downloadPNG() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "brand-qr.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  function downloadPNGTransparent() {
    if (!canvasRef.current) return;
    const tmp = document.createElement("canvas");
    tmp.width  = canvasRef.current.width;
    tmp.height = canvasRef.current.height;
    const ctx  = tmp.getContext("2d")!;
    // Draw on transparent background by skipping the BG fill
    ctx.drawImage(canvasRef.current, 0, 0);
    // Flood fill bg color → transparent using pixel replace
    const imgData = ctx.getImageData(0, 0, tmp.width, tmp.height);
    const d = imgData.data;
    const bg = parseInt(bgColor.slice(1), 16);
    const br = (bg >> 16) & 255, bgg = (bg >> 8) & 255, bb = bg & 255;
    for (let i = 0; i < d.length; i += 4) {
      if (Math.abs(d[i] - br) < 15 && Math.abs(d[i + 1] - bgg) < 15 && Math.abs(d[i + 2] - bb) < 15) {
        d[i + 3] = 0;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const link = document.createElement("a");
    link.download = "brand-qr-transparent.png";
    link.href = tmp.toDataURL("image/png");
    link.click();
  }

  async function downloadSVG() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const QRCode = (await import("qrcode")) as any;
    const data   = buildData(qrType, form);
    const svgStr = await QRCode.toString(data, { type: "svg", errorCorrectionLevel: "H", margin: 3, color: { dark: fgColor, light: bgColor } });
    const blob   = new Blob([svgStr], { type: "image/svg+xml" });
    const link   = document.createElement("a");
    link.download = "brand-qr.svg";
    link.href     = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const DOT_STYLES: { id: DotStyle; label: string }[] = [
    { id: "square",        label: "Square"     },
    { id: "dots",          label: "Dots"        },
    { id: "rounded",       label: "Rounded"    },
    { id: "extra-rounded", label: "Extra Round" },
    { id: "classy",        label: "Classy"     },
  ];

  const CORNER_STYLES: { id: CornerStyle; label: string }[] = [
    { id: "square",        label: "Square"      },
    { id: "extra-rounded", label: "Rounded"     },
    { id: "dot",           label: "Circle"      },
  ];

  const MOCKUP_OPTIONS: { id: MockupView; label: string; icon: string }[] = [
    { id: "none",   label: "None",         icon: "◻" },
    { id: "card",   label: "Business Card", icon: "💼" },
    { id: "phone",  label: "Phone",         icon: "📱" },
    { id: "poster", label: "Poster",        icon: "🖼" },
    { id: "stand",  label: "Table Stand",   icon: "🗂" },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── Left panel ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 w-full xl:w-[380px] flex-shrink-0">

        {/* QR Type selector */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <p className="font-body text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-muted)" }}>QR Type</p>
          <div className="grid grid-cols-4 gap-2">
            {QR_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => switchType(t.id)}
                className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all"
                style={{
                  background:  qrType === t.id ? "var(--color-accent-light)" : "var(--color-bg)",
                  border:      `1px solid ${qrType === t.id ? "var(--color-accent)" : "var(--color-border)"}`,
                  color:       qrType === t.id ? "var(--color-accent)" : "var(--color-muted)",
                }}
              >
                <span className="text-xl leading-none">{t.icon}</span>
                <span className="font-body text-[9px] font-semibold text-center leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <p className="font-body text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>Content</p>
          <FormPanel type={qrType} form={form} set={setField} />
        </div>

        {/* Style presets */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <p className="font-body text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-muted)" }}>Style Preset</p>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => applyPreset(p)}
                title={p.label}
                className="flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl transition-all"
                style={{
                  border: `2px solid ${preset.label === p.label ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: "var(--color-bg)",
                }}
              >
                {/* Swatch */}
                <div className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden relative" style={{ background: p.bg }}>
                  <div className="absolute inset-1 rounded" style={{
                    background: p.gradient ? `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})` : p.fg,
                    opacity: 0.8,
                  }} />
                </div>
                <span className="font-body text-[8px] text-center leading-tight" style={{ color: "var(--color-muted)" }}>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customise */}
        <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <p className="font-body text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>Customise</p>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Foreground">
              <div className="flex items-center gap-2">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer flex-shrink-0" style={{ border: "1px solid var(--color-border)", padding: 1 }} />
                <input type="text" value={fgColor} onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setFgColor(e.target.value); }} style={{ ...INPUT_STYLE, width: "auto", flex: 1, fontFamily: "monospace", fontSize: 12 }} />
              </div>
            </Field>
            <Field label="Background">
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer flex-shrink-0" style={{ border: "1px solid var(--color-border)", padding: 1 }} />
                <input type="text" value={bgColor} onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setBgColor(e.target.value); }} style={{ ...INPUT_STYLE, width: "auto", flex: 1, fontFamily: "monospace", fontSize: 12 }} />
              </div>
            </Field>
          </div>

          {lowContrast && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <span className="text-sm flex-shrink-0 mt-0.5">⚠️</span>
              <p className="font-body text-[11px]" style={{ color: "#EF4444" }}>Low contrast — QR codes may not scan reliably with this color combination.</p>
            </div>
          )}

          {/* Dot style */}
          <Field label="Dot Shape">
            <div className="flex flex-wrap gap-1.5">
              {DOT_STYLES.map((d) => (
                <button key={d.id} onClick={() => setDotStyle(d.id)}
                  className="font-body text-[11px] px-2.5 py-1 rounded-lg transition-all"
                  style={{ background: dotStyle === d.id ? "var(--color-accent)" : "var(--color-bg)", color: dotStyle === d.id ? "#fff" : "var(--color-muted)", border: `1px solid ${dotStyle === d.id ? "var(--color-accent)" : "var(--color-border)"}` }}>
                  {d.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Corner style */}
          <Field label="Corner Shape">
            <div className="flex flex-wrap gap-1.5">
              {CORNER_STYLES.map((c) => (
                <button key={c.id} onClick={() => setCornerStyle(c.id)}
                  className="font-body text-[11px] px-2.5 py-1 rounded-lg transition-all"
                  style={{ background: cornerStyle === c.id ? "var(--color-accent)" : "var(--color-bg)", color: cornerStyle === c.id ? "#fff" : "var(--color-muted)", border: `1px solid ${cornerStyle === c.id ? "var(--color-accent)" : "var(--color-border)"}` }}>
                  {c.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Logo */}
          <Field label="Center Logo (optional)">
            <div className="flex items-center gap-2">
              <button onClick={() => logoInputRef.current?.click()}
                className="font-body text-[12px] px-3 py-2 rounded-lg transition-colors flex-shrink-0"
                style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-muted)" }}>
                {logoUrl ? "Change Logo" : "Upload Logo"}
              </button>
              {logoUrl && (
                <button onClick={() => setLogoUrl(null)} className="font-body text-[11px]" style={{ color: "#EF4444" }}>Remove</button>
              )}
              {logoUrl && <img src={logoUrl} alt="logo" className="w-8 h-8 object-contain rounded" />}
            </div>
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </Field>
        </div>
      </div>

      {/* ── Right panel: Preview + Export ───────────────────────────────────── */}
      <div className="flex flex-col gap-5 flex-1 min-w-0">

        {/* QR Preview */}
        <div className="p-5 rounded-2xl flex flex-col items-center gap-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <div className="flex items-center justify-between w-full">
            <p className="font-body text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>Live Preview</p>
            {rendering && <span className="font-body text-[11px]" style={{ color: "var(--color-accent)" }}>Rendering…</span>}
          </div>

          {/* Hidden canvas for rendering */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Visible preview */}
          <div
            className="rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ width: 260, height: 260, background: bgColor, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", flexShrink: 0 }}
          >
            {previewSrc
              ? <img src={previewSrc} alt="Generated QR code" style={{ width: 220, height: 220, objectFit: "contain" }} />
              : <div className="w-10 h-10 rounded-full border-2 border-dashed" style={{ borderColor: "var(--color-border)" }} />
            }
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
            <button onClick={downloadPNG}
              className="flex items-center gap-1.5 px-4 py-2.5 font-body text-sm font-semibold text-white rounded-xl transition-all"
              style={{ background: "var(--color-accent)", boxShadow: "0 4px 14px rgba(255,61,0,0.3)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M3.5 6l3.5 4 3.5-4M1 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              PNG (1000px)
            </button>
            <button onClick={downloadSVG}
              className="flex items-center gap-1.5 px-4 py-2.5 font-body text-sm font-semibold rounded-xl transition-all"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-ink)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M3.5 6l3.5 4 3.5-4M1 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              SVG
            </button>
            <button onClick={downloadPNGTransparent}
              className="flex items-center gap-1.5 px-4 py-2.5 font-body text-sm font-semibold rounded-xl transition-all"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-ink)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M3.5 6l3.5 4 3.5-4M1 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Transparent PNG
            </button>
          </div>
        </div>

        {/* Mockup Preview */}
        <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <p className="font-body text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>Mockup Preview</p>

          {/* Mockup tabs */}
          <div className="flex flex-wrap gap-2">
            {MOCKUP_OPTIONS.map((m) => (
              <button key={m.id} onClick={() => setMockup(m.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 font-body text-[12px] font-medium rounded-lg transition-all"
                style={{ background: mockup === m.id ? "var(--color-accent-light)" : "var(--color-bg)", color: mockup === m.id ? "var(--color-accent)" : "var(--color-muted)", border: `1px solid ${mockup === m.id ? "var(--color-accent)" : "var(--color-border)"}` }}>
                <span>{m.icon}</span> {m.label}
              </button>
            ))}
          </div>

          {/* Mockup display */}
          {mockup !== "none" && previewSrc && (
            <div className="flex items-center justify-center py-8 overflow-x-auto">
              <Mockup view={mockup} previewSrc={previewSrc} preset={activePreset} />
            </div>
          )}
          {mockup === "none" && (
            <p className="font-body text-[12px] text-center py-4" style={{ color: "var(--color-muted)" }}>
              Select a mockup above to visualise your QR code on real-world materials.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
