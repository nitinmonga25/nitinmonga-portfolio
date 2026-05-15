"use client";

import { useEffect, useState, useCallback } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichEditor } from "@/components/admin/RichEditor";
import { tagsToInput } from "@/lib/parseTags";

const CATEGORIES = ["Web Design", "Branding", "3D CGI", "Full-Stack", "WordPress"];

const CATEGORY_COLORS: Record<string, string> = {
  "Web Design": "#3B82F6",
  Branding:     "#8B5CF6",
  "3D CGI":     "#F59E0B",
  "Full-Stack": "#10B981",
  WordPress:    "#6366F1",
};

interface Project {
  id:          number;
  title:       string;
  slug:        string;
  description: string;
  longDesc:    string;
  category:    string;
  thumbnail:   string;
  images:      string | null;
  tags:        string | null;
  techStack:   string | null;
  liveUrl:     string | null;
  featured:    boolean;
  published:   boolean;
  order:       number;
}

const EMPTY_FORM = (): Omit<Project, "id"> => ({
  title:       "",
  slug:        "",
  description: "",
  longDesc:    "",
  category:    "Web Design",
  thumbnail:   "",
  images:      null,
  tags:        "",
  techStack:   "",
  liveUrl:     "",
  featured:    false,
  published:   false,
  order:       0,
});

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  const [panel,    setPanel]    = useState<"closed" | "new" | "edit">("closed");
  const [form,     setForm]     = useState<Omit<Project, "id">>(EMPTY_FORM());
  const [editId,   setEditId]   = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/projects");
      const json = await res.json();
      if (json.ok) setProjects(json.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setForm(EMPTY_FORM());
    setEditId(null);
    setPanel("new");
    setError("");
  }

  function openEdit(p: Project) {
    setForm({
      title:       p.title,
      slug:        p.slug,
      description: p.description,
      longDesc:    p.longDesc ?? "",
      category:    p.category,
      thumbnail:   p.thumbnail,
      images:      p.images ?? null,
      tags:        tagsToInput(p.tags),
      techStack:   tagsToInput(p.techStack),
      liveUrl:     p.liveUrl ?? "",
      featured:    p.featured,
      published:   p.published,
      order:       p.order,
    });
    setEditId(p.id);
    setPanel("edit");
    setError("");
  }

  function closePanel() { setPanel("closed"); setError(""); }

  function f(key: keyof typeof form, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");

    const galleryImages: string[] = form.images
      ? (JSON.parse(form.images) as string[]).filter(Boolean)
      : [];

    const payload = {
      ...form,
      slug:      form.slug || slugify(form.title),
      images:    galleryImages,
      tags:      form.tags      ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      techStack: form.techStack ? form.techStack.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      const res = panel === "edit" && editId !== null
        ? await fetch(`/api/admin/projects/${editId}`, { method: "PUT",    headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/projects",            { method: "POST",   headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      await load();
      closePanel();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id: number) {
    if (!confirm("Delete this project?")) return;
    const res  = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) {
      setProjects((p) => p.filter((x) => x.id !== id));
    } else {
      setError("Failed to delete project. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Projects</h1>
          <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {projects.length} total · {projects.filter((p) => p.featured).length} featured
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 font-body text-sm font-semibold text-white"
          style={{ background: "#FF3D00", borderRadius: "10px", boxShadow: "0 4px 14px rgba(255,61,0,0.3)" }}
        >
          <span className="text-lg leading-none">+</span> Add Project
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Loading…</p>
        </div>
      ) : (
        <div style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>No projects yet.</p>
              <button onClick={openNew} className="font-body text-sm text-[#FF3D00] underline">Add your first project</button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Thumbnail", "Project", "Category", "Status", "Featured", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < projects.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <td className="px-4 py-3">
                      {p.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumbnail} alt={p.title} className="w-12 h-9 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <span className="text-white/20 text-xs">—</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-body text-sm text-white font-medium">{p.title}</p>
                      {p.liveUrl && <p className="font-body text-[11px] truncate max-w-[180px]" style={{ color: "rgba(255,255,255,0.3)" }}>{p.liveUrl}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${CATEGORY_COLORS[p.category] ?? "#555"}22`, color: CATEGORY_COLORS[p.category] ?? "#aaa" }}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: p.published ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)", color: p.published ? "#10B981" : "rgba(255,255,255,0.4)" }}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-xs" style={{ color: p.featured ? "#FF3D00" : "rgba(255,255,255,0.2)" }}>
                        {p.featured ? "★ Yes" : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(p)} className="font-body text-xs text-white/30 hover:text-white transition-colors">Edit</button>
                        <button onClick={() => deleteProject(p.id)} className="font-body text-xs text-white/20 hover:text-red-400 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Slide-over panel */}
      {panel !== "closed" && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.6)" }} onClick={closePanel} />
          <div
            className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-y-auto"
            style={{ width: "min(820px, 100vw)", background: "#161616", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <h2 className="font-display text-base font-bold text-white">{panel === "new" ? "New Project" : "Edit Project"}</h2>
              <button onClick={closePanel} className="text-white/30 hover:text-white transition-colors text-lg">✕</button>
            </div>

            {/* Form */}
            <div className="flex-1 flex flex-col gap-5 p-6">
              {/* Thumbnail */}
              <ImageUpload
                label="Thumbnail"
                value={form.thumbnail}
                onChange={(url) => f("thumbnail", url)}
                folder="nitinmonga/projects"
              />

              {/* Gallery Images */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Gallery Images
                    <span className="ml-2 normal-case tracking-normal font-normal" style={{ color: "rgba(255,255,255,0.25)" }}>
                      — shown as carousel on case study page
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const current: string[] = form.images ? JSON.parse(form.images) : [];
                      f("images", JSON.stringify([...current, ""]));
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 font-body text-xs font-semibold rounded-lg transition-colors"
                    style={{ background: "rgba(255,61,0,0.12)", color: "#FF3D00", border: "1px solid rgba(255,61,0,0.25)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Add Image
                  </button>
                </div>

                {(() => {
                  const imgs: string[] = form.images ? JSON.parse(form.images) : [];
                  if (imgs.length === 0) return (
                    <div
                      className="flex items-center justify-center py-8 rounded-xl font-body text-xs"
                      style={{ background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.2)" }}
                    >
                      No gallery images yet — click &quot;Add Image&quot; to upload
                    </div>
                  );
                  return (
                    <div className="flex flex-col gap-3">
                      {imgs.map((src, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <span className="font-mono text-[10px] pt-1 flex-shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>#{idx + 1}</span>
                          <div className="flex-1">
                            <ImageUpload
                              label=""
                              value={src}
                              onChange={(url) => {
                                const updated = [...imgs];
                                updated[idx] = url;
                                f("images", JSON.stringify(updated));
                              }}
                              folder="nitinmonga/projects/gallery"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = imgs.filter((_, i) => i !== idx);
                              f("images", updated.length ? JSON.stringify(updated) : null);
                            }}
                            className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-red-500/20 mt-1"
                            style={{ color: "rgba(255,80,80,0.6)" }}
                            title="Remove image"
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path d="M2 3h9M5 3V2h3v1M4 3l.5 8h4L9 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Title + Slug */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => { f("title", e.target.value); if (!editId) f("slug", slugify(e.target.value)); }}
                  placeholder="Project title"
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => f("slug", e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => f("category", e.target.value)}
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Short Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => f("description", e.target.value)}
                  placeholder="One-line summary shown in project listings"
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none resize-y"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              {/* Tech Stack */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={form.techStack ?? ""}
                  onChange={(e) => f("techStack", e.target.value)}
                  placeholder="Next.js, Tailwind, Prisma, MySQL"
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              {/* Case Study Body */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Case Study Content</label>
                <RichEditor
                  value={form.longDesc}
                  onChange={(html) => f("longDesc", html)}
                  placeholder="Write the full case study here — overview, challenges, solution, results…"
                  minHeight={360}
                />
              </div>

              {/* Live URL */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Live URL</label>
                <input
                  type="url"
                  value={form.liveUrl ?? ""}
                  onChange={(e) => f("liveUrl", e.target.value)}
                  placeholder="https://"
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags ?? ""}
                  onChange={(e) => f("tags", e.target.value)}
                  placeholder="Next.js, Tailwind, Prisma"
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              {/* Order */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => f("order", parseInt(e.target.value) || 0)}
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none w-24"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-4">
                {(["featured", "published"] as const).map((key) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key] as boolean}
                      onChange={(e) => f(key, e.target.checked)}
                      className="w-4 h-4 accent-[#FF3D00]"
                    />
                    <span className="font-body text-sm capitalize" style={{ color: "rgba(255,255,255,0.6)" }}>{key}</span>
                  </label>
                ))}
              </div>

              {error && <p className="font-body text-sm text-red-400">{error}</p>}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 py-2.5 font-body text-sm font-semibold text-white rounded-xl transition-all"
                style={{ background: saving ? "rgba(255,61,0,0.6)" : "#FF3D00" }}
              >
                {saving ? "Saving…" : panel === "new" ? "Create Project" : "Save Changes"}
              </button>
              <button onClick={closePanel} className="px-5 font-body text-sm rounded-xl transition-colors" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
