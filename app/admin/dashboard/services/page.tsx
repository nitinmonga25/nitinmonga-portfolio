"use client";

import { useState } from "react";

const INITIAL_SERVICES = [
  { id: 1, title: "Web Design & Development", tagline: "Pixel-perfect websites that convert",      price: "From ₹25,000", active: true  },
  { id: 2, title: "3D CGI & Motion",          tagline: "Cinematic ads, product renders & VFX",   price: "From ₹40,000", active: true  },
  { id: 3, title: "Graphic Design",           tagline: "Brand identity, print & social media",    price: "From ₹15,000", active: true  },
  { id: 4, title: "Full-Stack Development",   tagline: "Scalable apps built with Next.js",        price: "From ₹60,000", active: true  },
  { id: 5, title: "WordPress & WooCommerce",  tagline: "Custom themes, plugins & online stores",  price: "From ₹20,000", active: true  },
  { id: 6, title: "Social Media Creatives",   tagline: "Motion graphics & carousel posts",        price: "From ₹10,000", active: false },
];

export default function ServicesAdminPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", tagline: "", price: "From ₹", active: true });
  const [editing, setEditing] = useState<number | null>(null);

  function saveService() {
    if (!form.title.trim()) return;
    if (editing !== null) {
      setServices((s) => s.map((x) => x.id === editing ? { ...x, ...form } : x));
      setEditing(null);
    } else {
      setServices((s) => [...s, { ...form, id: Date.now() }]);
    }
    setForm({ title: "", tagline: "", price: "From ₹", active: true });
    setShowForm(false);
  }

  function startEdit(svc: typeof INITIAL_SERVICES[0]) {
    setForm({ title: svc.title, tagline: svc.tagline, price: svc.price, active: svc.active });
    setEditing(svc.id);
    setShowForm(true);
  }

  function toggleActive(id: number) {
    setServices((s) => s.map((x) => x.id === id ? { ...x, active: !x.active } : x));
  }

  return (
    <div className="flex flex-col gap-6 max-w-[800px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Services</h1>
          <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {services.filter((s) => s.active).length} active services
          </p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setEditing(null); setForm({ title: "", tagline: "", price: "From ₹", active: true }); }}
          className="flex items-center gap-2 px-4 py-2.5 font-body text-sm font-semibold text-white"
          style={{ background: "#FF3D00", borderRadius: "10px", boxShadow: "0 4px 14px rgba(255,61,0,0.3)" }}
        >
          <span className="text-lg leading-none">+</span>
          Add Service
        </button>
      </div>

      {showForm && (
        <div
          className="p-5 flex flex-col gap-4"
          style={{ background: "#1C1C1C", border: "1px solid rgba(255,61,0,0.3)", borderRadius: "16px" }}
        >
          <h2 className="font-display text-sm font-semibold text-white">{editing !== null ? "Edit Service" : "New Service"}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="sm:col-span-2 px-4 py-2.5 font-body text-sm text-white outline-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              placeholder="Service title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <input
              className="px-4 py-2.5 font-body text-sm text-white outline-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              placeholder="Tagline"
              value={form.tagline}
              onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
            />
            <input
              className="px-4 py-2.5 font-body text-sm text-white outline-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              placeholder="Price (e.g. From ₹25,000)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={saveService} className="px-5 py-2 font-body text-sm font-semibold text-white" style={{ background: "#FF3D00", borderRadius: "8px" }}>
              {editing !== null ? "Update" : "Save"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2 font-body text-sm text-white/50 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="flex items-center gap-4 p-5"
            style={{
              background: "#1C1C1C",
              border: `1px solid ${svc.active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)"}`,
              borderRadius: "14px",
              opacity: svc.active ? 1 : 0.5,
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-semibold text-white">{svc.title}</p>
              <p className="font-body text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{svc.tagline}</p>
            </div>
            <span className="font-body text-sm font-semibold flex-shrink-0" style={{ color: "#FF3D00" }}>{svc.price}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleActive(svc.id)}
                className="px-3 py-1.5 font-body text-xs rounded-lg transition-all"
                style={{
                  background: svc.active ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)",
                  color:      svc.active ? "#10B981" : "rgba(255,255,255,0.3)",
                }}
              >
                {svc.active ? "Active" : "Hidden"}
              </button>
              <button onClick={() => startEdit(svc)} className="px-3 py-1.5 font-body text-xs text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
