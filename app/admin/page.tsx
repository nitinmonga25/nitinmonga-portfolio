"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("nm-admin-auth") === "1") {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const validEmail    = process.env.NEXT_PUBLIC_ADMIN_EMAIL    ?? "nitinmonga14@gmail.com";
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "NM@Admin2025";

    if (email === validEmail && password === validPassword) {
      localStorage.setItem("nm-admin-auth", "1");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)" }}>
      {/* Background dot grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,61,0,0.4) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <span className="font-display text-2xl font-bold text-white tracking-tight">NM</span>
          <span className="w-2 h-2 rounded-full bg-[#FF3D00]" />
          <span className="font-body text-sm text-white/50 tracking-widest uppercase">Admin</span>
        </div>

        {/* Card */}
        <div
          className="p-8"
          style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
        >
          <h1 className="font-display text-xl font-bold text-white mb-1">Welcome back</h1>
          <p className="font-body text-sm text-white/50 mb-7">Sign in to your admin panel</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-semibold uppercase tracking-[2px] text-white/40">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nitinmonga14@gmail.com"
                className="w-full px-4 py-3 font-body text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,61,0,0.6)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-semibold uppercase tracking-[2px] text-white/40">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 font-body text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background: "#262626", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,61,0,0.6)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg" style={{ background: "rgba(255,61,0,0.12)", border: "1px solid rgba(255,61,0,0.3)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="6" stroke="#FF3D00" strokeWidth="1.2"/>
                  <path d="M7 4v4M7 9.5v.5" stroke="#FF3D00" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span className="font-body text-xs text-[#FF3D00]">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-1 font-body text-sm font-semibold text-white transition-all"
              style={{
                background: loading ? "rgba(255,61,0,0.6)" : "#FF3D00",
                borderRadius: "10px",
                boxShadow: "0 4px 16px rgba(255,61,0,0.3)",
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-xs text-white/20 mt-6">
          nitinmonga.in · Admin Panel
        </p>
      </div>
    </div>
  );
}
