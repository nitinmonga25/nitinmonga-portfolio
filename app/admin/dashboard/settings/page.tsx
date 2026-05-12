"use client";

import { useState, useEffect } from "react";

const PROFILE_KEY = "content.profile";

export default function SettingsAdminPage() {
  const [profile, setProfile] = useState({
    name:     "Nitin Monga",
    email:    "nitinmonga14@gmail.com",
    location: "Punjab, India",
    bio:      "Graphic Designer, 3D Artist & Full-Stack Developer with 10+ years of experience.",
  });
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data[PROFILE_KEY]) {
          setProfile((prev) => ({ ...prev, ...json.data[PROFILE_KEY] }));
        }
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveState("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ key: PROFILE_KEY, value: profile }),
      });
      setSaveState(res.ok ? "saved" : "error");
      if (res.ok) setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          Manage your profile and site configuration
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Profile */}
        <Section title="Profile">
          <Field label="Full Name">
            <Input value={profile.name} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
          </Field>
          <Field label="Email">
            <Input type="email" value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} />
          </Field>
          <Field label="Location">
            <Input value={profile.location} onChange={(v) => setProfile((p) => ({ ...p, location: v }))} />
          </Field>
          <Field label="Bio">
            <textarea
              className="w-full px-4 py-3 font-body text-sm text-white outline-none resize-none"
              style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", minHeight: "80px" }}
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            />
          </Field>
        </Section>

        {/* Admin Password */}
        <Section title="Admin Credentials">
          <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,61,0,0.08)", border: "1px solid rgba(255,61,0,0.2)" }}>
            <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              Admin email and password are set via environment variables{" "}
              <code className="px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.1)", fontSize: "11px" }}>NEXT_PUBLIC_ADMIN_EMAIL</code>{" "}
              and{" "}
              <code className="px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.1)", fontSize: "11px" }}>NEXT_PUBLIC_ADMIN_PASSWORD</code>.
              Update them in your <code className="px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.1)", fontSize: "11px" }}>.env.local</code> file.
            </p>
          </div>
        </Section>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saveState === "saving"}
            className="px-6 py-3 font-body text-sm font-semibold text-white transition-all"
            style={{
              background:  saveState === "error" ? "#EF4444" : saveState === "saved" ? "#10B981" : "#FF3D00",
              borderRadius: "10px",
              boxShadow:   "0 4px 14px rgba(255,61,0,0.3)",
              opacity:     saveState === "saving" ? 0.7 : 1,
            }}
          >
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved ✓" : saveState === "error" ? "Error — retry" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="p-5 flex flex-col gap-4"
      style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px" }}
    >
      <h2 className="font-display text-sm font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value, onChange, type = "text", placeholder,
}: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 font-body text-sm text-white outline-none transition-all"
      style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,61,0,0.5)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    />
  );
}
