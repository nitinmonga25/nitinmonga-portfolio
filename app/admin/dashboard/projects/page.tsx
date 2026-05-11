"use client";

import { useState } from "react";

const INITIAL_PROJECTS = [
  { id: 1, title: "Xdecoders Studio Website",  category: "Web Design",  status: "Published", year: 2024, featured: true  },
  { id: 2, title: "DJYoungster Brand Identity", category: "Branding",    status: "Published", year: 2024, featured: true  },
  { id: 3, title: "CineLions Production House",  category: "3D CGI",      status: "Published", year: 2023, featured: true  },
  { id: 4, title: "Punjab Agri Portal",          category: "Full-Stack",  status: "Published", year: 2023, featured: false },
  { id: 5, title: "Amritsar Tourism Campaign",   category: "3D CGI",      status: "Published", year: 2023, featured: false },
  { id: 6, title: "Monga Jewellers E-Commerce",  category: "WordPress",   status: "Draft",     year: 2024, featured: false },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Web Design": "#3B82F6",
  "Branding":   "#8B5CF6",
  "3D CGI":     "#F59E0B",
  "Full-Stack": "#10B981",
  "WordPress":  "#6366F1",
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Web Design", status: "Draft", year: new Date().getFullYear(), featured: false });

  function addProject() {
    if (!form.title.trim()) return;
    setProjects((p) => [{ ...form, id: Date.now() }, ...p]);
    setForm({ title: "", category: "Web Design", status: "Draft", year: new Date().getFullYear(), featured: false });
    setShowForm(false);
  }

  function toggleFeatured(id: number) {
    setProjects((p) => p.map((x) => x.id === id ? { ...x, featured: !x.featured } : x));
  }

  function deleteProject(id: number) {
    setProjects((p) => p.filter((x) => x.id !== id));
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
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 font-body text-sm font-semibold text-white transition-all"
          style={{ background: "#FF3D00", borderRadius: "10px", boxShadow: "0 4px 14px rgba(255,61,0,0.3)" }}
        >
          <span className="text-lg leading-none">+</span>
          Add Project
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div
          className="p-5 flex flex-col gap-4"
          style={{ background: "#1C1C1C", border: "1px solid rgba(255,61,0,0.3)", borderRadius: "16px" }}
        >
          <h2 className="font-display text-sm font-semibold text-white">New Project</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="px-4 py-2.5 font-body text-sm text-white outline-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              placeholder="Project title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <select
              className="px-4 py-2.5 font-body text-sm text-white outline-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {["Web Design", "Branding", "3D CGI", "Full-Stack", "WordPress"].map((c) => (
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
            <label className="flex items-center gap-3 px-4 py-2.5 cursor-pointer" style={{ background: "#262626", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 accent-[#FF3D00]"
              />
              <span className="font-body text-sm text-white/70">Featured project</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addProject}
              className="px-5 py-2 font-body text-sm font-semibold text-white"
              style={{ background: "#FF3D00", borderRadius: "8px" }}
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 font-body text-sm text-white/50 hover:text-white transition-colors"
            >
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
              {["Project", "Category", "Year", "Status", "Featured", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left font-body text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < projects.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <td className="px-5 py-3.5 font-body text-sm text-white font-medium">{p.title}</td>
                <td className="px-5 py-3.5">
                  <span
                    className="font-body text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${CATEGORY_COLORS[p.category] ?? "#555"}22`, color: CATEGORY_COLORS[p.category] ?? "#aaa" }}
                  >
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-body text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{p.year}</td>
                <td className="px-5 py-3.5">
                  <span
                    className="font-body text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: p.status === "Published" ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)",
                      color:      p.status === "Published" ? "#10B981" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggleFeatured(p.id)}
                    className="font-body text-xs px-2.5 py-1 rounded-full transition-all"
                    style={{
                      background: p.featured ? "rgba(255,61,0,0.15)" : "rgba(255,255,255,0.06)",
                      color:      p.featured ? "#FF3D00" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {p.featured ? "★ Yes" : "☆ No"}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => deleteProject(p.id)}
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
