"use client";

import { useState } from "react";

const INITIAL_POSTS = [
  { id: 1, title: "How I Built 400+ Websites in 10 Years",         category: "Business",   status: "Published", date: "2025-03-10", views: 1240 },
  { id: 2, title: "Next.js vs WordPress: Which One in 2025?",      category: "Dev",        status: "Published", date: "2025-02-22", views: 980  },
  { id: 3, title: "CGI Ads: My Blender Workflow for Brands",       category: "3D Design",  status: "Published", date: "2025-02-08", views: 670  },
  { id: 4, title: "Why Bricolage Grotesque is My Favourite Font",  category: "Design",     status: "Published", date: "2025-01-29", views: 450  },
  { id: 5, title: "Building a Portfolio with Next.js 14",          category: "Dev",        status: "Published", date: "2025-01-15", views: 1100 },
  { id: 6, title: "From Freelance to Studio: Lessons Learned",     category: "Business",   status: "Draft",     date: "2025-04-01", views: 0    },
];

const CAT_COLORS: Record<string, string> = {
  Business: "#F59E0B",
  Dev: "#3B82F6",
  "3D Design": "#8B5CF6",
  Design: "#10B981",
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Design", status: "Draft" });

  function addPost() {
    if (!form.title.trim()) return;
    setPosts((p) => [{ ...form, id: Date.now(), date: new Date().toISOString().slice(0, 10), views: 0 }, ...p]);
    setForm({ title: "", category: "Design", status: "Draft" });
    setShowForm(false);
  }

  function deletePost(id: number) {
    setPosts((p) => p.filter((x) => x.id !== id));
  }

  function toggleStatus(id: number) {
    setPosts((p) => p.map((x) => x.id === id ? { ...x, status: x.status === "Published" ? "Draft" : "Published" } : x));
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Blog Posts</h1>
          <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {posts.filter((p) => p.status === "Published").length} published · {posts.filter((p) => p.status === "Draft").length} drafts
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 font-body text-sm font-semibold text-white"
          style={{ background: "#FF3D00", borderRadius: "10px", boxShadow: "0 4px 14px rgba(255,61,0,0.3)" }}
        >
          <span className="text-lg leading-none">+</span>
          New Post
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div
          className="p-5 flex flex-col gap-4"
          style={{ background: "#1C1C1C", border: "1px solid rgba(255,61,0,0.3)", borderRadius: "16px" }}
        >
          <h2 className="font-display text-sm font-semibold text-white">New Blog Post</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="sm:col-span-2 px-4 py-2.5 font-body text-sm text-white outline-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              placeholder="Post title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <select
              className="px-4 py-2.5 font-body text-sm text-white outline-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {["Design", "Dev", "3D Design", "Business"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="px-4 py-2.5 font-body text-sm text-white outline-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={addPost} className="px-5 py-2 font-body text-sm font-semibold text-white" style={{ background: "#FF3D00", borderRadius: "8px" }}>
              Save
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 font-body text-sm text-white/50 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Title", "Category", "Date", "Views", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left font-body text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < posts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <td className="px-5 py-3.5 font-body text-sm text-white font-medium max-w-[260px] truncate">{p.title}</td>
                <td className="px-5 py-3.5">
                  <span
                    className="font-body text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${CAT_COLORS[p.category] ?? "#555"}22`, color: CAT_COLORS[p.category] ?? "#aaa" }}
                  >
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-body text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{p.date}</td>
                <td className="px-5 py-3.5 font-body text-sm font-medium text-white">{p.views > 0 ? p.views.toLocaleString() : "—"}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggleStatus(p.id)}
                    className="font-body text-xs font-semibold px-2.5 py-1 rounded-full transition-all"
                    style={{
                      background: p.status === "Published" ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)",
                      color:      p.status === "Published" ? "#10B981" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {p.status}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => deletePost(p.id)}
                    className="font-body text-xs text-white/20 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
