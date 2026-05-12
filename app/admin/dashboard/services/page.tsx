"use client";

import { useState, useEffect, useCallback } from "react";

const CONTENT_KEY = "content.home.services";

interface ServiceItem {
  title:       string;
  description: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { title: "Web Design",          description: "Conversion-focused designs delivered as pixel-perfect Figma mockups before development begins." },
  { title: "WordPress Dev",       description: "Fast, SEO-optimized WordPress sites with custom themes. Hand-coded — no page-builder bloat." },
  { title: "Next.js Dev",         description: "Modern web apps with Next.js 14, TypeScript, Prisma and Tailwind. SSR, SSG, API routes included." },
  { title: "Branding & Identity", description: "Logo design, brand guidelines, colour systems and typography that make you instantly recognizable." },
  { title: "3D & CGI Production", description: "Product visualization, CGI ads and 3D motion graphics. 40+ campaigns delivered using Blender & C4D." },
  { title: "SEO & Monetization",  description: "Technical SEO audits, content strategy, AdSense & affiliate setup. My platforms hit 75K+ monthly impressions." },
];

type SaveState = "idle" | "saving" | "saved" | "error";

export default function ServicesAdminPage() {
  const [services,   setServices]   = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [loading,    setLoading]    = useState(true);
  const [saveState,  setSaveState]  = useState<SaveState>("idle");
  const [editIndex,  setEditIndex]  = useState<number | null>(null);
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState<ServiceItem>({ title: "", description: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/content");
      const json = await res.json();
      if (json.ok && json.data[CONTENT_KEY]?.services?.length) {
        setServices(json.data[CONTENT_KEY].services);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function persist(updated: ServiceItem[]) {
    setSaveState("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ key: CONTENT_KEY, value: { services: updated } }),
      });
      setSaveState(res.ok ? "saved" : "error");
      if (res.ok) setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  }

  function openNew() {
    setForm({ title: "", description: "" });
    setEditIndex(null);
    setShowForm(true);
  }

  function openEdit(i: number) {
    setForm({ ...services[i] });
    setEditIndex(i);
    setShowForm(true);
  }

  function saveForm() {
    if (!form.title.trim()) return;
    let updated: ServiceItem[];
    if (editIndex !== null) {
      updated = services.map((s, i) => i === editIndex ? form : s);
    } else {
      updated = [...services, form];
    }
    setServices(updated);
    persist(updated);
    setShowForm(false);
    setEditIndex(null);
  }

  function remove(i: number) {
    if (!confirm("Remove this service?")) return;
    const updated = services.filter((_, idx) => idx !== i);
    setServices(updated);
    persist(updated);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= services.length) return;
    const updated = [...services];
    [updated[i], updated[j]] = [updated[j], updated[i]];
    setServices(updated);
    persist(updated);
  }

  return (
    <div className="flex flex-col gap-6 max-w-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Services</h1>
          <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {services.length} services shown on the site
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveState !== "idle" && (
            <span className="font-body text-xs" style={{
              color: saveState === "saved" ? "#10B981" : saveState === "error" ? "#EF4444" : "rgba(255,255,255,0.4)",
            }}>
              {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved ✓" : "Error saving"}
            </span>
          )}
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 font-body text-sm font-semibold text-white"
            style={{ background: "#FF3D00", borderRadius: "10px", boxShadow: "0 4px 14px rgba(255,61,0,0.3)" }}
          >
            <span className="text-lg leading-none">+</span> Add Service
          </button>
        </div>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div
          className="p-5 flex flex-col gap-4"
          style={{ background: "#1C1C1C", border: "1px solid rgba(255,61,0,0.3)", borderRadius: "16px" }}
        >
          <h2 className="font-display text-sm font-semibold text-white">
            {editIndex !== null ? "Edit Service" : "New Service"}
          </h2>
          <div className="flex flex-col gap-3">
            <input
              className="w-full px-4 py-2.5 font-body text-sm text-white outline-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              placeholder="Service title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 font-body text-sm text-white outline-none resize-y"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              placeholder="Service description shown on the public site"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={saveForm}
              className="px-5 py-2 font-body text-sm font-semibold text-white"
              style={{ background: "#FF3D00", borderRadius: "8px" }}
            >
              {editIndex !== null ? "Update" : "Save"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditIndex(null); }}
              className="px-5 py-2 font-body text-sm text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Loading…</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((svc, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5"
              style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px" }}
            >
              {/* Order controls */}
              <div className="flex flex-col gap-1 flex-shrink-0 mt-0.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/10 disabled:opacity-20"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 7l3-4 3 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === services.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/10 disabled:opacity-20"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3l3 4 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Number badge */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-display text-xs font-bold"
                style={{ background: "rgba(255,61,0,0.12)", color: "#FF3D00" }}
              >
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-white">{svc.title}</p>
                <p className="font-body text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {svc.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(i)}
                  className="px-3 py-1.5 font-body text-xs rounded-lg transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(i)}
                  className="px-3 py-1.5 font-body text-xs rounded-lg transition-colors hover:bg-red-400/10 hover:text-red-400"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
