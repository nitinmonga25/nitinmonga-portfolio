"use client";

import { useEffect, useState, useCallback } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichEditor } from "@/components/admin/RichEditor";
import { tagsToInput } from "@/lib/parseTags";

const CATEGORIES = ["Design", "Dev", "3D Design", "Business", "SEO"];

const CAT_COLORS: Record<string, string> = {
  Business:   "#F59E0B",
  Dev:        "#3B82F6",
  "3D Design":"#8B5CF6",
  Design:     "#10B981",
  SEO:        "#EC4899",
};

interface BlogPost {
  id:          number;
  title:       string;
  slug:        string;
  excerpt:     string;
  content:     string;
  category:    string;
  thumbnail:   string | null;
  tags:        string | null;
  readTime:    number;
  published:   boolean;
  publishedAt: string | null;
  createdAt:   string;
  views:       number;
}

const EMPTY_FORM = (): Omit<BlogPost, "id" | "publishedAt" | "createdAt" | "views"> => ({
  title:     "",
  slug:      "",
  excerpt:   "",
  content:   "",
  category:  "Design",
  thumbnail: "",
  tags:      "",
  readTime:  5,
  published: false,
});

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogAdminPage() {
  const [posts,   setPosts]   = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  const [panel,      setPanel]      = useState<"closed" | "new" | "edit">("closed");
  const [form,       setForm]       = useState<Omit<BlogPost, "id" | "publishedAt" | "createdAt" | "views">>(EMPTY_FORM());
  const [editId,     setEditId]     = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError,   setGenError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/blog");
      const json = await res.json();
      if (json.ok) setPosts(json.data);
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

  function openEdit(p: BlogPost) {
    setForm({
      title:     p.title,
      slug:      p.slug,
      excerpt:   p.excerpt,
      content:   p.content,
      category:  p.category,
      thumbnail: p.thumbnail ?? "",
      tags:      tagsToInput(p.tags),
      readTime:  p.readTime,
      published: p.published,
    });
    setEditId(p.id);
    setPanel("edit");
    setError("");
  }

  function closePanel() { setPanel("closed"); setError(""); }

  function f(key: keyof typeof form, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function generateContent() {
    if (!form.title.trim()) { setGenError("Enter a title first"); return; }
    setGenerating(true);
    setGenError("");
    try {
      const res  = await fetch("/api/admin/blog/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ title: form.title, category: form.category }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      const { content, excerpt, tags, readTime } = json.data;
      setForm((prev) => ({
        ...prev,
        content:  content  || prev.content,
        excerpt:  excerpt  || prev.excerpt,
        tags:     tags     || prev.tags,
        readTime: readTime || prev.readTime,
      }));
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function save() {
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      slug:  form.slug || slugify(form.title),
      tags:  form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      const res = panel === "edit" && editId !== null
        ? await fetch(`/api/admin/blog/${editId}`, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/blog",           { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

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

  async function deletePost(id: number) {
    if (!confirm("Delete this post?")) return;
    const res  = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) {
      setPosts((p) => p.filter((x) => x.id !== id));
    } else {
      setError("Failed to delete post. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Blog Posts</h1>
          <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {posts.filter((p) => p.published).length} published · {posts.filter((p) => !p.published).length} drafts
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 font-body text-sm font-semibold text-white"
          style={{ background: "#FF3D00", borderRadius: "10px", boxShadow: "0 4px 14px rgba(255,61,0,0.3)" }}
        >
          <span className="text-lg leading-none">+</span> New Post
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Loading…</p>
        </div>
      ) : (
        <div style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>No posts yet.</p>
              <button onClick={openNew} className="font-body text-sm text-[#FF3D00] underline">Write your first post</button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Thumbnail", "Title", "Category", "Read Time", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < posts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
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
                      <p className="font-body text-sm text-white font-medium max-w-[220px] truncate">{p.title}</p>
                      <p className="font-body text-[11px] truncate max-w-[220px]" style={{ color: "rgba(255,255,255,0.3)" }}>{p.excerpt}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${CAT_COLORS[p.category] ?? "#555"}22`, color: CAT_COLORS[p.category] ?? "#aaa" }}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{p.readTime} min</td>
                    <td className="px-4 py-3">
                      <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: p.published ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)", color: p.published ? "#10B981" : "rgba(255,255,255,0.4)" }}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(p)} className="font-body text-xs text-white/30 hover:text-white transition-colors">Edit</button>
                        <button onClick={() => deletePost(p.id)} className="font-body text-xs text-white/20 hover:text-red-400 transition-colors">Delete</button>
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
            style={{ width: "min(800px, 100vw)", background: "#161616", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <h2 className="font-display text-base font-bold text-white">{panel === "new" ? "New Post" : "Edit Post"}</h2>
              <button onClick={closePanel} className="text-white/30 hover:text-white transition-colors text-lg">✕</button>
            </div>

            {/* Form */}
            <div className="flex-1 flex flex-col gap-5 p-6">
              {/* Thumbnail */}
              <ImageUpload
                label="Cover Image"
                value={form.thumbnail ?? ""}
                onChange={(url) => f("thumbnail", url)}
                folder="nitinmonga/blog"
              />

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => { f("title", e.target.value); if (!editId) f("slug", slugify(e.target.value)); }}
                  placeholder="Post title"
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              {/* AI Generate */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={generateContent}
                  disabled={generating || !form.title.trim()}
                  className="flex items-center justify-center gap-2 w-full py-2.5 font-body text-sm font-semibold rounded-lg transition-all"
                  style={{
                    background: generating
                      ? "rgba(139,92,246,0.4)"
                      : !form.title.trim()
                      ? "rgba(139,92,246,0.2)"
                      : "rgba(139,92,246,0.85)",
                    border: "1px solid rgba(139,92,246,0.5)",
                    color: !form.title.trim() ? "rgba(255,255,255,0.3)" : "#fff",
                    cursor: !form.title.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {generating ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Researching and writing… this takes 20-40s
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                      Generate Article with AI
                    </>
                  )}
                </button>
                {genError && <p className="font-body text-xs text-red-400">{genError}</p>}
                {!generating && form.content && (
                  <p className="font-body text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Content generated. Review and edit below before publishing.
                  </p>
                )}
              </div>

              {/* Slug */}
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

              {/* Category + Read time */}
              <div className="grid grid-cols-2 gap-3">
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
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Read Time (min)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.readTime}
                    onChange={(e) => f("readTime", parseInt(e.target.value) || 5)}
                    className="font-body text-sm px-3 py-2.5 rounded-lg outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Excerpt</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => f("excerpt", e.target.value)}
                  placeholder="Short description shown in post listings"
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none resize-y"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Content</label>
                <RichEditor
                  value={form.content}
                  onChange={(html) => f("content", html)}
                  placeholder="Write your post content here…"
                  minHeight={380}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags ?? ""}
                  onChange={(e) => f("tags", e.target.value)}
                  placeholder="Next.js, Design, Tips"
                  className="font-body text-sm px-3 py-2.5 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                />
              </div>

              {/* Published toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => f("published", e.target.checked)}
                  className="w-4 h-4 accent-[#FF3D00]"
                />
                <span className="font-body text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Publish immediately</span>
              </label>

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
                {saving ? "Saving…" : panel === "new" ? "Create Post" : "Save Changes"}
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
