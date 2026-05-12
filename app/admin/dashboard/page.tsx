"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface StatsData {
  projectCount:    number;
  postCount:       number;
  messageCount:    number;
  unreadCount:     number;
  recentMessages:  { id: number; name: string; email: string; service: string | null; createdAt: string; read: boolean }[];
}

const QUICK_LINKS = [
  { href: "/admin/dashboard/projects", label: "Add Project",   icon: "+" },
  { href: "/admin/dashboard/blog",     label: "Write Post",    icon: "✎" },
  { href: "/admin/dashboard/messages", label: "View Messages", icon: "✉" },
  { href: "/admin/dashboard/settings", label: "Settings",      icon: "⚙" },
];

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)   return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1)  return "Yesterday";
  return `${days} days ago`;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((json) => { if (json.ok) setStats(json.data); });
  }, []);

  const STATS_CONFIG = [
    { label: "Total Projects", value: stats ? String(stats.projectCount) : "—",  sub: "Published",                                     color: "#FF3D00" },
    { label: "Blog Posts",     value: stats ? String(stats.postCount)     : "—",  sub: "Published",                                     color: "#3B82F6" },
    { label: "Messages",       value: stats ? String(stats.messageCount)  : "—",  sub: stats ? `Unread: ${stats.unreadCount}` : "—",    color: "#10B981" },
    { label: "Services",       value: "6",                                          sub: "Active",                                        color: "#8B5CF6" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      {/* Page title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="font-body text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          Welcome back, Nitin. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CONFIG.map(({ label, value, sub, color }) => (
          <div
            key={label}
            className="p-5 flex flex-col gap-3"
            style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px" }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
              <span className="w-3 h-3 rounded-full" style={{ background: color }} />
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-white leading-none">{value}</p>
              <p className="font-body text-xs text-white/40 mt-1">{sub}</p>
            </div>
            <p className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Messages */}
        <div
          className="lg:col-span-2 flex flex-col"
          style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="font-display text-sm font-semibold text-white">Recent Messages</h2>
            <Link
              href="/admin/dashboard/messages"
              className="font-body text-xs transition-colors hover:text-white"
              style={{ color: "#FF3D00" }}
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {!stats ? (
              <div className="flex items-center justify-center h-24">
                <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading…</p>
              </div>
            ) : stats.recentMessages.length === 0 ? (
              <div className="flex items-center justify-center h-24">
                <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>No messages yet.</p>
              </div>
            ) : (
              stats.recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-display text-xs font-bold text-white"
                    style={{ background: msg.read ? "rgba(255,255,255,0.08)" : "#FF3D00" }}
                  >
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-body text-sm font-medium text-white truncate">{msg.name}</p>
                      {!msg.read && <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF3D00]" />}
                    </div>
                    <p className="font-body text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {msg.service ?? msg.email}
                    </p>
                  </div>
                  <span className="font-body text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div
          className="flex flex-col"
          style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="font-display text-sm font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {QUICK_LINKS.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-body text-sm flex-shrink-0 transition-colors group-hover:bg-[#FF3D00]"
                  style={{ background: "rgba(255,61,0,0.15)", color: "#FF3D00" }}
                >
                  {icon}
                </span>
                <span className="font-body text-sm text-white/70 group-hover:text-white transition-colors">
                  {label}
                </span>
                <svg className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="#FF3D00" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}
          </div>

          {/* Site status */}
          <div className="px-4 pb-4 mt-auto">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div>
                <p className="font-body text-xs font-semibold text-emerald-400">Site Online</p>
                <p className="font-body text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>nitinmonga.in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
