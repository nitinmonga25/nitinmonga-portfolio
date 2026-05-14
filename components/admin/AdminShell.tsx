"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/admin/dashboard",          label: "Dashboard",  icon: "grid"     },
  { href: "/admin/dashboard/content",  label: "Content",    icon: "edit"     },
  { href: "/admin/dashboard/projects", label: "Projects",   icon: "folder"   },
  { href: "/admin/dashboard/blog",     label: "Blog",       icon: "file"     },
  { href: "/admin/dashboard/clients",  label: "Clients",    icon: "users"    },
  { href: "/admin/dashboard/messages", label: "Messages",   icon: "mail"     },
  { href: "/admin/dashboard/services", label: "Services",   icon: "layers"   },
  { href: "/admin/dashboard/settings", label: "Settings",   icon: "settings" },
];

const ICONS: Record<string, React.ReactNode> = {
  edit: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M9 4l3 3" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  grid: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  folder: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 4a1 1 0 0 1 1-1h4l2 2h6a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4z" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  file: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M11 7a2.5 2.5 0 100-5M15 13a4 4 0 00-4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  layers: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1L14 5l-6 4-6-4 6-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M2 9l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M2 12l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("nm-admin-auth") !== "1") {
      router.replace("/admin");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("nm-admin-auth");
    router.push("/admin");
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0F0F0F" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width: "240px", background: "#141414", borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 h-16 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="font-display text-lg font-bold text-white">NM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00]" />
          <span className="font-body text-xs text-white/40 tracking-widest uppercase ml-1">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                style={{
                  color:      active ? "#fff" : "rgba(255,255,255,0.45)",
                  background: active ? "rgba(255,61,0,0.15)" : "transparent",
                  fontFamily: "var(--font-bricolage)",
                  fontSize:   "13.5px",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span style={{ color: active ? "#FF3D00" : "rgba(255,255,255,0.3)" }}>
                  {ICONS[icon]}
                </span>
                {label}
                {active && (
                  <span className="ml-auto w-1 h-4 rounded-full bg-[#FF3D00]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FF3D00" }}>
              <span className="font-display text-xs font-bold text-white">NM</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs font-semibold text-white truncate">Nitin Monga</p>
              <p className="font-body text-[10px] text-white/30 truncate">Administrator</p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 12H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M9.5 4.5L12 7l-2.5 2.5M12 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 h-16 flex-shrink-0"
          style={{ background: "#141414", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-bricolage)", fontSize: "12px" }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M5.5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M7.5 1.5h4m0 0v4m0-4L5.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Site
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
