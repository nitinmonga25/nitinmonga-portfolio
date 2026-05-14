"use client";

import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ClientLogo {
  id:   string;
  name: string;
  logo: string;
  url:  string;
}

const KEY = "content.home.clients";

function newLogo(): ClientLogo {
  return { id: Date.now().toString(), name: "", logo: "", url: "" };
}

export default function ClientsAdminPage() {
  const [logos,     setLogos]     = useState<ClientLogo[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && Array.isArray(json.data[KEY])) {
          setLogos(json.data[KEY]);
        }
      });
  }, []);

  async function handleSave() {
    setSaveState("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ key: KEY, value: logos }),
      });
      setSaveState(res.ok ? "saved" : "error");
      if (res.ok) setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
    }
  }

  function update(id: string, field: keyof ClientLogo, value: string) {
    setLogos((prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l));
  }

  function remove(id: string) {
    setLogos((prev) => prev.filter((l) => l.id !== id));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setLogos((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    setLogos((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-[760px]">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Client Logos</h1>
        <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          Manage logos shown in the scrolling clients section on the homepage.
        </p>
      </div>

      {/* Logo cards */}
      <div className="flex flex-col gap-4">
        {logos.map((logo, index) => (
          <div
            key={logo.id}
            className="p-5 flex flex-col gap-4"
            style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                Logo {index + 1}
              </span>
              <div className="flex items-center gap-2">
                {/* Move up */}
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10 disabled:opacity-25"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  title="Move up"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 8.5l4.5-4.5 4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Move down */}
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === logos.length - 1}
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10 disabled:opacity-25"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  title="Move down"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 4.5L6.5 9l4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Delete */}
                <button
                  onClick={() => remove(logo.id)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-red-500/20"
                  style={{ color: "rgba(255,80,80,0.7)" }}
                  title="Remove"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 3h9M5 3V2h3v1M4 3l.5 8h4L9 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Logo upload */}
            <ImageUpload
              value={logo.logo}
              onChange={(v) => update(logo.id, "logo", v)}
              folder="nitinmonga/clients"
              label="Logo Image"
            />

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                Client Name
              </label>
              <input
                type="text"
                value={logo.name}
                placeholder="e.g. Acme Corp"
                onChange={(e) => update(logo.id, "name", e.target.value)}
                className="w-full px-4 py-2.5 font-body text-sm text-white outline-none transition-all"
                style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,61,0,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {/* URL */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                Website URL <span style={{ color: "rgba(255,255,255,0.2)" }}>(optional)</span>
              </label>
              <input
                type="url"
                value={logo.url}
                placeholder="https://client.com"
                onChange={(e) => update(logo.id, "url", e.target.value)}
                className="w-full px-4 py-2.5 font-body text-sm text-white outline-none transition-all"
                style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,61,0,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add logo button */}
      <button
        onClick={() => setLogos((prev) => [...prev, newLogo()])}
        className="flex items-center justify-center gap-2 py-3 font-body text-sm font-semibold rounded-xl transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Add Client Logo
      </button>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saveState === "saving"}
        className="self-start px-6 py-3 font-body text-sm font-semibold text-white transition-all"
        style={{
          background:   saveState === "error" ? "#EF4444" : saveState === "saved" ? "#10B981" : "#FF3D00",
          borderRadius: "10px",
          boxShadow:    "0 4px 14px rgba(255,61,0,0.3)",
          opacity:      saveState === "saving" ? 0.7 : 1,
        }}
      >
        {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved ✓" : saveState === "error" ? "Error — retry" : "Save Changes"}
      </button>
    </div>
  );
}
