"use client";

import { useEffect, useState, useCallback } from "react";

interface Message {
  id:        number;
  name:      string;
  email:     string;
  phone:     string | null;
  service:   string | null;
  budget:    string | null;
  message:   string;
  read:      boolean;
  createdAt: string;
}

export default function MessagesAdminPage() {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [selected,  setSelected]  = useState<Message | null>(null);
  const [loading,   setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/messages");
      const json = await res.json();
      if (json.ok) setMessages(json.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function markRead(msg: Message) {
    if (msg.read) return;
    await fetch(`/api/admin/messages/${msg.id}`, { method: "PUT" });
    setMessages((m) => m.map((x) => x.id === msg.id ? { ...x, read: true } : x));
  }

  async function deleteMsg(id: number) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setMessages((m) => m.filter((x) => x.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function open(msg: Message) {
    setSelected(msg);
    markRead(msg);
  }

  const unread = messages.filter((m) => !m.read).length;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1100px]">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3">
          Messages
          {unread > 0 && (
            <span className="font-body text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,61,0,0.2)", color: "#FF3D00" }}>
              {unread} new
            </span>
          )}
        </h1>
        <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          {messages.length} total contact submissions
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Loading…</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2" style={{ background: "#1C1C1C", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>No messages yet.</p>
          <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Submissions from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* List */}
          <div
            className="lg:col-span-2 flex flex-col divide-y"
            style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden", divideColor: "rgba(255,255,255,0.04)" }}
          >
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => open(msg)}
                className="flex items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-white/5 w-full"
                style={{
                  background:  selected?.id === msg.id ? "rgba(255,61,0,0.08)" : "transparent",
                  borderLeft:  selected?.id === msg.id ? "2px solid #FF3D00" : "2px solid transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-display text-xs font-bold text-white mt-0.5"
                  style={{ background: msg.read ? "rgba(255,255,255,0.08)" : "#FF3D00" }}
                >
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-body text-sm font-semibold text-white truncate">{msg.name}</p>
                    <span className="font-body text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="font-body text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {[msg.service, msg.budget].filter(Boolean).join(" · ") || msg.email}
                  </p>
                  <p className="font-body text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {msg.message}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div
            className="lg:col-span-3"
            style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}
          >
            {selected ? (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div>
                    <h2 className="font-display text-base font-bold text-white">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="font-body text-xs hover:text-[#FF3D00] transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {selected.email}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteMsg(selected.id)}
                    className="px-3 py-1.5 font-body text-xs text-red-400 hover:bg-red-400/10 transition-colors rounded-lg"
                  >
                    Delete
                  </button>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-5 px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {[
                    { label: "Phone",   value: selected.phone   || "—" },
                    { label: "Service", value: selected.service || "—" },
                    { label: "Budget",  value: selected.budget  || "—" },
                    { label: "Date",    value: formatDate(selected.createdAt) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="font-body text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
                      <span className="font-body text-sm font-medium text-white">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Message */}
                <div className="px-6 py-5 flex-1">
                  <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>Message</p>
                  <p className="font-body text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {selected.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.service || "Your Inquiry"}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 font-body text-sm font-semibold text-white transition-all"
                    style={{ background: "#FF3D00", borderRadius: "10px", boxShadow: "0 4px 14px rgba(255,61,0,0.3)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M13 1L1 6l5 2 2 5 5-12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Reply via Email
                  </a>
                  {selected.phone && (
                    <a
                      href={`tel:${selected.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 font-body text-sm font-semibold transition-all"
                      style={{ background: "rgba(255,255,255,0.06)", borderRadius: "10px", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 2h3l1.5 3-1.5 1.5a8 8 0 003.5 3.5L10 8.5l3 1.5v3a1 1 0 01-1 1A11 11 0 011 3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Call
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="1" y="4" width="20" height="14" rx="2" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
                    <path d="M1 7l10 7 10-7" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
