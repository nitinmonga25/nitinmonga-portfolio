"use client";

import { useEffect, useState, useCallback } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";

// ─── Types ───────────────────────────────────────────────────────────────────

type ContentData = Record<string, unknown>;
type SaveState = "idle" | "saving" | "saved" | "error";

// ─── Field editors ────────────────────────────────────────────────────────────

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-body text-[14px] px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#FF3D00] transition-all"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
        {label}
      </label>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="font-body text-[14px] px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#FF3D00] transition-all resize-y"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
      />
    </div>
  );
}

function ArrayField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
        {label}
      </label>
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 font-body text-[13px] px-3 py-1.5 rounded-lg outline-none focus:ring-1 focus:ring-[#FF3D00]"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          />
          <button
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="px-2 py-1 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors font-body text-[12px]"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, ""])}
        className="self-start font-body text-[12px] px-3 py-1 rounded-lg transition-colors"
        style={{ background: "rgba(255,61,0,0.15)", color: "#FF3D00", border: "1px solid rgba(255,61,0,0.3)" }}
      >
        + Add Item
      </button>
    </div>
  );
}

// ─── Section card wrapper ────────────────────────────────────────────────────

function SectionCard({ title, children, onSave, saveState }: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  saveState: SaveState;
}) {
  return (
    <div
      className="flex flex-col gap-5 p-6 rounded-2xl"
      style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
        <button
          onClick={onSave}
          disabled={saveState === "saving"}
          className="font-body text-[12px] px-4 py-1.5 rounded-lg transition-all duration-150"
          style={{
            background: saveState === "saved" ? "#10B981" : saveState === "error" ? "#EF4444" : "#FF3D00",
            color: "#fff",
            opacity: saveState === "saving" ? 0.6 : 1,
          }}
        >
          {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved ✓" : saveState === "error" ? "Error" : "Save"}
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}

// ─── Page tabs ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "home",     label: "Home" },
  { id: "about",    label: "About" },
  { id: "services", label: "Services" },
  { id: "work",     label: "Work" },
  { id: "blog",     label: "Blog" },
  { id: "contact",  label: "Contact" },
  { id: "footer",   label: "Footer" },
  { id: "meta",     label: "Meta / SEO" },
];

// ─── Main content editor component ───────────────────────────────────────────

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [data, setData] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setData(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const update = useCallback((key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const save = useCallback(async (key: string) => {
    setSaveStates((s) => ({ ...s, [key]: "saving" }));
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: data[key] }),
      });
      setSaveStates((s) => ({ ...s, [key]: res.ok ? "saved" : "error" }));
      if (res.ok) setTimeout(() => setSaveStates((s) => ({ ...s, [key]: "idle" })), 2000);
    } catch {
      setSaveStates((s) => ({ ...s, [key]: "error" }));
    }
  }, [data]);

  const get = <T,>(key: string, fallback: T): T => (data[key] as T) ?? fallback;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="font-body text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Loading content…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[900px]">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Content Editor</h1>
        <p className="font-body text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          Edit all page content. Changes are saved to the database immediately.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="font-body text-[13px] px-4 py-1.5 rounded-full transition-all duration-150"
            style={{
              background: activeTab === id ? "#FF3D00" : "rgba(255,255,255,0.06)",
              color: activeTab === id ? "#fff" : "rgba(255,255,255,0.5)",
              border: `1px solid ${activeTab === id ? "#FF3D00" : "rgba(255,255,255,0.1)"}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="flex flex-col gap-5">

        {/* HOME */}
        {activeTab === "home" && (
          <>
            {/* Hero */}
            <SectionCard title="Hero Section" onSave={() => save("content.home.hero")} saveState={saveStates["content.home.hero"] ?? "idle"}>
              <TextareaField
                label="Bio Text"
                value={get<{ bio: string; roles: string[] }>("content.home.hero", { bio: "", roles: [] }).bio}
                onChange={(v) => update("content.home.hero", { ...get("content.home.hero", { bio: "", roles: [] }), bio: v })}
              />
              <ArrayField
                label="Roles (typewriter)"
                value={get<{ bio: string; roles: string[] }>("content.home.hero", { bio: "", roles: [] }).roles}
                onChange={(v) => update("content.home.hero", { ...get("content.home.hero", { bio: "", roles: [] }), roles: v })}
              />
            </SectionCard>

            {/* Stats */}
            <SectionCard title="Stats Section" onSave={() => save("content.home.stats")} saveState={saveStates["content.home.stats"] ?? "idle"}>
              {(get<Array<{ value: number; suffix: string; label: string }>>("content.home.stats", [])).map((stat, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <TextField
                    label={`Stat ${i + 1} Value`}
                    value={String(stat.value)}
                    onChange={(v) => {
                      const next = [...get<Array<{ value: number; suffix: string; label: string }>>("content.home.stats", [])];
                      next[i] = { ...next[i], value: Number(v) };
                      update("content.home.stats", next);
                    }}
                  />
                  <TextField
                    label="Suffix"
                    value={stat.suffix}
                    onChange={(v) => {
                      const next = [...get<Array<{ value: number; suffix: string; label: string }>>("content.home.stats", [])];
                      next[i] = { ...next[i], suffix: v };
                      update("content.home.stats", next);
                    }}
                  />
                  <TextField
                    label="Label"
                    value={stat.label}
                    onChange={(v) => {
                      const next = [...get<Array<{ value: number; suffix: string; label: string }>>("content.home.stats", [])];
                      next[i] = { ...next[i], label: v };
                      update("content.home.stats", next);
                    }}
                  />
                </div>
              ))}
            </SectionCard>

            {/* About */}
            <SectionCard title="About Section" onSave={() => save("content.home.about")} saveState={saveStates["content.home.about"] ?? "idle"}>
              <ImageUpload
                label="Your Photo"
                value={get<{ photo: string }>("content.home.about", { photo: "" }).photo}
                onChange={(url) => update("content.home.about", { ...get("content.home.about", {}), photo: url })}
                folder="nitinmonga/profile"
              />
              <TextField
                label="Heading (use \n for line break)"
                value={get<{ heading: string; bioParagraphs: string[]; chips: string[]; timeline: unknown[] }>("content.home.about", { heading: "", bioParagraphs: [], chips: [], timeline: [] }).heading}
                onChange={(v) => update("content.home.about", { ...get("content.home.about", {}), heading: v })}
              />
              <ArrayField
                label="Bio Paragraphs"
                value={get<{ bioParagraphs: string[] }>("content.home.about", { bioParagraphs: [] }).bioParagraphs}
                onChange={(v) => update("content.home.about", { ...get("content.home.about", {}), bioParagraphs: v })}
              />
              <ArrayField
                label="Skill Chips"
                value={get<{ chips: string[] }>("content.home.about", { chips: [] }).chips}
                onChange={(v) => update("content.home.about", { ...get("content.home.about", {}), chips: v })}
              />
            </SectionCard>

            {/* Services */}
            <SectionCard title="Services Section" onSave={() => save("content.home.services")} saveState={saveStates["content.home.services"] ?? "idle"}>
              {(get<{ services: Array<{ title: string; description: string }> }>("content.home.services", { services: [] }).services).map((svc, i) => (
                <div key={i} className="flex flex-col gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <TextField
                    label={`Service ${i + 1} Title`}
                    value={svc.title}
                    onChange={(v) => {
                      const next = { ...get<{ services: Array<{ title: string; description: string }> }>("content.home.services", { services: [] }) };
                      next.services = [...next.services];
                      next.services[i] = { ...next.services[i], title: v };
                      update("content.home.services", next);
                    }}
                  />
                  <TextareaField
                    label="Description"
                    rows={2}
                    value={svc.description}
                    onChange={(v) => {
                      const next = { ...get<{ services: Array<{ title: string; description: string }> }>("content.home.services", { services: [] }) };
                      next.services = [...next.services];
                      next.services[i] = { ...next.services[i], description: v };
                      update("content.home.services", next);
                    }}
                  />
                </div>
              ))}
            </SectionCard>

            {/* Testimonials */}
            <SectionCard title="Testimonials Section" onSave={() => save("content.home.testimonials")} saveState={saveStates["content.home.testimonials"] ?? "idle"}>
              {(get<Array<{ name: string; role: string; quote: string; avatar: string; rating: number }>>("content.home.testimonials", [])).map((t, i) => (
                <div key={i} className="flex flex-col gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Testimonial {i + 1}
                    </span>
                    <button
                      onClick={() => {
                        const next = get<Array<{ name: string; role: string; quote: string; avatar: string; rating: number }>>("content.home.testimonials", []).filter((_, idx) => idx !== i);
                        update("content.home.testimonials", next);
                      }}
                      className="font-body text-[11px] px-2 py-0.5 rounded text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="Name" value={t.name} onChange={(v) => {
                      const next = [...get<Array<{ name: string; role: string; quote: string; avatar: string; rating: number }>>("content.home.testimonials", [])];
                      next[i] = { ...next[i], name: v };
                      update("content.home.testimonials", next);
                    }} />
                    <TextField label="Role / Company" value={t.role} onChange={(v) => {
                      const next = [...get<Array<{ name: string; role: string; quote: string; avatar: string; rating: number }>>("content.home.testimonials", [])];
                      next[i] = { ...next[i], role: v };
                      update("content.home.testimonials", next);
                    }} />
                  </div>
                  <TextareaField label="Quote" rows={3} value={t.quote} onChange={(v) => {
                    const next = [...get<Array<{ name: string; role: string; quote: string; avatar: string; rating: number }>>("content.home.testimonials", [])];
                    next[i] = { ...next[i], quote: v };
                    update("content.home.testimonials", next);
                  }} />
                  <div className="grid grid-cols-[1fr_80px] gap-3">
                    <TextField label="Avatar URL (optional)" value={t.avatar ?? ""} onChange={(v) => {
                      const next = [...get<Array<{ name: string; role: string; quote: string; avatar: string; rating: number }>>("content.home.testimonials", [])];
                      next[i] = { ...next[i], avatar: v };
                      update("content.home.testimonials", next);
                    }} />
                    <TextField label="Rating (1–5)" value={String(t.rating)} onChange={(v) => {
                      const val = Math.min(5, Math.max(1, Number(v) || 5));
                      const next = [...get<Array<{ name: string; role: string; quote: string; avatar: string; rating: number }>>("content.home.testimonials", [])];
                      next[i] = { ...next[i], rating: val };
                      update("content.home.testimonials", next);
                    }} />
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const next = [
                    ...get<Array<{ name: string; role: string; quote: string; avatar: string; rating: number }>>("content.home.testimonials", []),
                    { name: "", role: "", quote: "", avatar: "", rating: 5 },
                  ];
                  update("content.home.testimonials", next);
                }}
                className="self-start font-body text-[12px] px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: "rgba(255,61,0,0.15)", color: "#FF3D00", border: "1px solid rgba(255,61,0,0.3)" }}
              >
                + Add Testimonial
              </button>
            </SectionCard>

            {/* Contact */}
            <SectionCard title="Contact Section" onSave={() => save("content.home.contact")} saveState={saveStates["content.home.contact"] ?? "idle"}>
              <TextField
                label="Heading (use \n for line break)"
                value={get<{ heading: string; body: string; email: string; location: string }>("content.home.contact", { heading: "", body: "", email: "", location: "" }).heading}
                onChange={(v) => update("content.home.contact", { ...get("content.home.contact", {}), heading: v })}
              />
              <TextareaField
                label="Body Text"
                value={get<{ body: string }>("content.home.contact", { body: "" }).body}
                onChange={(v) => update("content.home.contact", { ...get("content.home.contact", {}), body: v })}
              />
              <TextField
                label="Email"
                value={get<{ email: string }>("content.home.contact", { email: "" }).email}
                onChange={(v) => update("content.home.contact", { ...get("content.home.contact", {}), email: v })}
              />
              <TextField
                label="Location"
                value={get<{ location: string }>("content.home.contact", { location: "" }).location}
                onChange={(v) => update("content.home.contact", { ...get("content.home.contact", {}), location: v })}
              />
            </SectionCard>
          </>
        )}

        {/* ABOUT */}
        {activeTab === "about" && (
          <>
            <SectionCard title="About Hero" onSave={() => save("content.about.hero")} saveState={saveStates["content.about.hero"] ?? "idle"}>
              <TextField
                label="Title (use \n for line breaks)"
                value={get<{ title: string; chips: string[]; stats: unknown[] }>("content.about.hero", { title: "", chips: [], stats: [] }).title}
                onChange={(v) => update("content.about.hero", { ...get("content.about.hero", {}), title: v })}
              />
              <ArrayField
                label="Skill Chips"
                value={get<{ chips: string[] }>("content.about.hero", { chips: [] }).chips}
                onChange={(v) => update("content.about.hero", { ...get("content.about.hero", {}), chips: v })}
              />
            </SectionCard>

            <SectionCard title="Bio Section" onSave={() => save("content.about.bio")} saveState={saveStates["content.about.bio"] ?? "idle"}>
              <TextField
                label="Section Heading"
                value={get<{ sectionHeading: string }>("content.about.bio", { sectionHeading: "" }).sectionHeading}
                onChange={(v) => update("content.about.bio", { ...get("content.about.bio", {}), sectionHeading: v })}
              />
              <ArrayField
                label="Paragraphs"
                value={get<{ paragraphs: string[] }>("content.about.bio", { paragraphs: [] }).paragraphs}
                onChange={(v) => update("content.about.bio", { ...get("content.about.bio", {}), paragraphs: v })}
              />
              <ArrayField
                label="Services List"
                value={get<{ services: string[] }>("content.about.bio", { services: [] }).services}
                onChange={(v) => update("content.about.bio", { ...get("content.about.bio", {}), services: v })}
              />
            </SectionCard>

            <SectionCard title="Timeline" onSave={() => save("content.about.timeline")} saveState={saveStates["content.about.timeline"] ?? "idle"}>
              <TextField
                label="Heading"
                value={get<{ heading: string }>("content.about.timeline", { heading: "" }).heading}
                onChange={(v) => update("content.about.timeline", { ...get("content.about.timeline", {}), heading: v })}
              />
              {(get<{ milestones: Array<{ year: string; title: string; desc: string }> }>("content.about.timeline", { milestones: [] }).milestones).map((m, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="Year" value={m.year} onChange={(v) => {
                      const ms = [...get<{ milestones: Array<{ year: string; title: string; desc: string }> }>("content.about.timeline", { milestones: [] }).milestones];
                      ms[i] = { ...ms[i], year: v };
                      update("content.about.timeline", { ...get("content.about.timeline", {}), milestones: ms });
                    }} />
                    <TextField label="Title" value={m.title} onChange={(v) => {
                      const ms = [...get<{ milestones: Array<{ year: string; title: string; desc: string }> }>("content.about.timeline", { milestones: [] }).milestones];
                      ms[i] = { ...ms[i], title: v };
                      update("content.about.timeline", { ...get("content.about.timeline", {}), milestones: ms });
                    }} />
                  </div>
                  <TextareaField label="Description" rows={2} value={m.desc} onChange={(v) => {
                    const ms = [...get<{ milestones: Array<{ year: string; title: string; desc: string }> }>("content.about.timeline", { milestones: [] }).milestones];
                    ms[i] = { ...ms[i], desc: v };
                    update("content.about.timeline", { ...get("content.about.timeline", {}), milestones: ms });
                  }} />
                </div>
              ))}
            </SectionCard>

            <SectionCard title="Skills" onSave={() => save("content.about.skills")} saveState={saveStates["content.about.skills"] ?? "idle"}>
              {(get<{ groups: Array<{ category: string; items: Array<{ name: string; level: number }> }> }>("content.about.skills", { groups: [] }).groups).map((group, gi) => (
                <div key={gi} className="flex flex-col gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <TextField label="Category" value={group.category} onChange={(v) => {
                    const gs = [...get<{ groups: Array<{ category: string; items: Array<{ name: string; level: number }> }> }>("content.about.skills", { groups: [] }).groups];
                    gs[gi] = { ...gs[gi], category: v };
                    update("content.about.skills", { groups: gs });
                  }} />
                  {group.items.map((item, ii) => (
                    <div key={ii} className="grid grid-cols-[1fr_80px] gap-2">
                      <TextField label={`Skill ${ii + 1}`} value={item.name} onChange={(v) => {
                        const gs = [...get<{ groups: Array<{ category: string; items: Array<{ name: string; level: number }> }> }>("content.about.skills", { groups: [] }).groups];
                        gs[gi] = { ...gs[gi], items: gs[gi].items.map((it, idx) => idx === ii ? { ...it, name: v } : it) };
                        update("content.about.skills", { groups: gs });
                      }} />
                      <TextField label="Level %" value={String(item.level)} onChange={(v) => {
                        const gs = [...get<{ groups: Array<{ category: string; items: Array<{ name: string; level: number }> }> }>("content.about.skills", { groups: [] }).groups];
                        gs[gi] = { ...gs[gi], items: gs[gi].items.map((it, idx) => idx === ii ? { ...it, level: Number(v) } : it) };
                        update("content.about.skills", { groups: gs });
                      }} />
                    </div>
                  ))}
                </div>
              ))}
            </SectionCard>
          </>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <>
            <SectionCard title="Services Hero" onSave={() => save("content.services.hero")} saveState={saveStates["content.services.hero"] ?? "idle"}>
              <TextField
                label="Title (use \n for line break)"
                value={get<{ title: string; subtitle: string; pills: string[] }>("content.services.hero", { title: "", subtitle: "", pills: [] }).title}
                onChange={(v) => update("content.services.hero", { ...get("content.services.hero", {}), title: v })}
              />
              <TextareaField
                label="Subtitle"
                value={get<{ subtitle: string }>("content.services.hero", { subtitle: "" }).subtitle}
                onChange={(v) => update("content.services.hero", { ...get("content.services.hero", {}), subtitle: v })}
              />
              <ArrayField
                label="Service Pills"
                value={get<{ pills: string[] }>("content.services.hero", { pills: [] }).pills}
                onChange={(v) => update("content.services.hero", { ...get("content.services.hero", {}), pills: v })}
              />
            </SectionCard>

            <SectionCard title="Services Grid" onSave={() => save("content.services.grid")} saveState={saveStates["content.services.grid"] ?? "idle"}>
              {(get<{ services: Array<{ id: string; title: string; description: string; includes: string[] }> }>("content.services.grid", { services: [] }).services).map((svc, i) => (
                <div key={i} className="flex flex-col gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <TextField label="Title" value={svc.title} onChange={(v) => {
                    const next = { ...get<{ services: Array<{ id: string; title: string; description: string; includes: string[] }> }>("content.services.grid", { services: [] }) };
                    next.services = [...next.services];
                    next.services[i] = { ...next.services[i], title: v };
                    update("content.services.grid", next);
                  }} />
                  <TextareaField label="Description" rows={2} value={svc.description} onChange={(v) => {
                    const next = { ...get<{ services: Array<{ id: string; title: string; description: string; includes: string[] }> }>("content.services.grid", { services: [] }) };
                    next.services = [...next.services];
                    next.services[i] = { ...next.services[i], description: v };
                    update("content.services.grid", next);
                  }} />
                  <ArrayField label="Includes" value={svc.includes} onChange={(v) => {
                    const next = { ...get<{ services: Array<{ id: string; title: string; description: string; includes: string[] }> }>("content.services.grid", { services: [] }) };
                    next.services = [...next.services];
                    next.services[i] = { ...next.services[i], includes: v };
                    update("content.services.grid", next);
                  }} />
                </div>
              ))}
            </SectionCard>

            <SectionCard title="Process Steps" onSave={() => save("content.services.process")} saveState={saveStates["content.services.process"] ?? "idle"}>
              {(get<{ steps: Array<{ num: string; title: string; desc: string }> }>("content.services.process", { steps: [] }).steps).map((step, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <TextField label="Title" value={step.title} onChange={(v) => {
                    const ss = [...get<{ steps: Array<{ num: string; title: string; desc: string }> }>("content.services.process", { steps: [] }).steps];
                    ss[i] = { ...ss[i], title: v };
                    update("content.services.process", { ...get("content.services.process", {}), steps: ss });
                  }} />
                  <TextareaField label="Description" rows={2} value={step.desc} onChange={(v) => {
                    const ss = [...get<{ steps: Array<{ num: string; title: string; desc: string }> }>("content.services.process", { steps: [] }).steps];
                    ss[i] = { ...ss[i], desc: v };
                    update("content.services.process", { ...get("content.services.process", {}), steps: ss });
                  }} />
                </div>
              ))}
            </SectionCard>

            <SectionCard title="FAQ" onSave={() => save("content.services.faq")} saveState={saveStates["content.services.faq"] ?? "idle"}>
              <TextField
                label="Section Heading"
                value={get<{ heading: string }>("content.services.faq", { heading: "" }).heading}
                onChange={(v) => update("content.services.faq", { ...get("content.services.faq", {}), heading: v })}
              />
              {(get<{ faqs: Array<{ q: string; a: string }> }>("content.services.faq", { faqs: [] }).faqs).map((faq, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <TextField label="Question" value={faq.q} onChange={(v) => {
                    const fs = [...get<{ faqs: Array<{ q: string; a: string }> }>("content.services.faq", { faqs: [] }).faqs];
                    fs[i] = { ...fs[i], q: v };
                    update("content.services.faq", { ...get("content.services.faq", {}), faqs: fs });
                  }} />
                  <TextareaField label="Answer" rows={3} value={faq.a} onChange={(v) => {
                    const fs = [...get<{ faqs: Array<{ q: string; a: string }> }>("content.services.faq", { faqs: [] }).faqs];
                    fs[i] = { ...fs[i], a: v };
                    update("content.services.faq", { ...get("content.services.faq", {}), faqs: fs });
                  }} />
                </div>
              ))}
            </SectionCard>
          </>
        )}

        {/* WORK */}
        {activeTab === "work" && (
          <SectionCard title="Work Page Hero" onSave={() => save("content.work.hero")} saveState={saveStates["content.work.hero"] ?? "idle"}>
            <TextField
              label="Title (use \n for line break)"
              value={get<{ title: string; subtitle: string }>("content.work.hero", { title: "", subtitle: "" }).title}
              onChange={(v) => update("content.work.hero", { ...get("content.work.hero", {}), title: v })}
            />
            <TextareaField
              label="Subtitle"
              value={get<{ subtitle: string }>("content.work.hero", { subtitle: "" }).subtitle}
              onChange={(v) => update("content.work.hero", { ...get("content.work.hero", {}), subtitle: v })}
            />
          </SectionCard>
        )}

        {/* BLOG */}
        {activeTab === "blog" && (
          <SectionCard title="Blog Page Hero" onSave={() => save("content.blog.hero")} saveState={saveStates["content.blog.hero"] ?? "idle"}>
            <TextField
              label="Title (use \n for line break)"
              value={get<{ title: string; subtitle: string; topics: string[] }>("content.blog.hero", { title: "", subtitle: "", topics: [] }).title}
              onChange={(v) => update("content.blog.hero", { ...get("content.blog.hero", {}), title: v })}
            />
            <TextareaField
              label="Subtitle"
              value={get<{ subtitle: string }>("content.blog.hero", { subtitle: "" }).subtitle}
              onChange={(v) => update("content.blog.hero", { ...get("content.blog.hero", {}), subtitle: v })}
            />
            <ArrayField
              label="Topics"
              value={get<{ topics: string[] }>("content.blog.hero", { topics: [] }).topics}
              onChange={(v) => update("content.blog.hero", { ...get("content.blog.hero", {}), topics: v })}
            />
          </SectionCard>
        )}

        {/* CONTACT */}
        {activeTab === "contact" && (
          <>
            <SectionCard title="Contact Hero" onSave={() => save("content.contact.hero")} saveState={saveStates["content.contact.hero"] ?? "idle"}>
              <TextField
                label="Title (use \n for line break)"
                value={get<{ title: string }>("content.contact.hero", { title: "" }).title}
                onChange={(v) => update("content.contact.hero", { ...get("content.contact.hero", {}), title: v })}
              />
              <TextareaField
                label="Subtitle"
                value={get<{ subtitle: string }>("content.contact.hero", { subtitle: "" }).subtitle}
                onChange={(v) => update("content.contact.hero", { ...get("content.contact.hero", {}), subtitle: v })}
              />
              <TextField
                label="Email"
                value={get<{ email: string }>("content.contact.hero", { email: "" }).email}
                onChange={(v) => update("content.contact.hero", { ...get("content.contact.hero", {}), email: v })}
              />
              <TextField
                label="Location"
                value={get<{ location: string }>("content.contact.hero", { location: "" }).location}
                onChange={(v) => update("content.contact.hero", { ...get("content.contact.hero", {}), location: v })}
              />
              <TextField
                label="Response Time"
                value={get<{ responseTime: string }>("content.contact.hero", { responseTime: "" }).responseTime}
                onChange={(v) => update("content.contact.hero", { ...get("content.contact.hero", {}), responseTime: v })}
              />
            </SectionCard>

            <SectionCard title="Contact Form" onSave={() => save("content.contact.form")} saveState={saveStates["content.contact.form"] ?? "idle"}>
              <TextField
                label="Heading"
                value={get<{ heading: string }>("content.contact.form", { heading: "" }).heading}
                onChange={(v) => update("content.contact.form", { ...get("content.contact.form", {}), heading: v })}
              />
              <TextareaField
                label="Subtitle"
                value={get<{ subtitle: string }>("content.contact.form", { subtitle: "" }).subtitle}
                onChange={(v) => update("content.contact.form", { ...get("content.contact.form", {}), subtitle: v })}
              />
            </SectionCard>
          </>
        )}

        {/* FOOTER */}
        {activeTab === "footer" && (
          <SectionCard title="Footer Social Links" onSave={() => save("content.footer.social")} saveState={saveStates["content.footer.social"] ?? "idle"}>
            <p className="font-body text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Enter full URLs (e.g. https://instagram.com/yourhandle). Leave blank to hide the icon.
            </p>
            {(["instagram", "linkedin", "youtube", "twitter", "facebook", "behance"] as const).map((platform) => (
              <TextField
                key={platform}
                label={platform.charAt(0).toUpperCase() + platform.slice(1) + " URL"}
                value={get<Record<string, string>>("content.footer.social", {})[platform] ?? ""}
                onChange={(v) => update("content.footer.social", {
                  ...get("content.footer.social", {}),
                  [platform]: v,
                })}
              />
            ))}
          </SectionCard>
        )}

        {/* META / SEO */}
        {activeTab === "meta" && (
          <>
            {["home", "about", "services", "work", "blog", "contact", "tools", "tools-ui-analyzer", "tools-color-palette"].map((page) => (
              <SectionCard
                key={page}
                title={`${page.charAt(0).toUpperCase() + page.slice(1)} Page Meta`}
                onSave={() => save(`meta.${page}`)}
                saveState={saveStates[`meta.${page}`] ?? "idle"}
              >
                <TextField
                  label="Page Title"
                  value={get<{ title: string; description: string }>(`meta.${page}`, { title: "", description: "" }).title}
                  onChange={(v) => update(`meta.${page}`, { ...get(`meta.${page}`, {}), title: v })}
                />
                <TextareaField
                  label="Meta Description"
                  rows={2}
                  value={get<{ description: string }>(`meta.${page}`, { description: "" }).description}
                  onChange={(v) => update(`meta.${page}`, { ...get(`meta.${page}`, {}), description: v })}
                />
              </SectionCard>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
