"use client";

import { useState } from "react";

const INITIAL_MESSAGES = [
  { id: 1, name: "Amandeep Singh",  email: "amandeep@example.com", service: "Web Design",  budget: "₹50K–₹1L",  message: "Hi Nitin, I need a professional website for my startup. Can we discuss?",                          date: "2025-05-10", read: false },
  { id: 2, name: "Priya Sharma",    email: "priya@startup.co",     service: "Full-Stack",  budget: "₹1L–₹3L",   message: "Looking for a Next.js developer to build our SaaS platform. Timeline 3 months.",                   date: "2025-05-10", read: false },
  { id: 3, name: "Rajiv Kumar",     email: "rajiv@brand.in",       service: "3D CGI",      budget: "₹50K–₹1L",  message: "Need a CGI ad for our new product launch. Can you create something like your CineLions work?",    date: "2025-05-09", read: false },
  { id: 4, name: "Neha Gupta",      email: "neha@agency.com",      service: "Branding",    budget: "₹20K–₹50K", message: "I run a boutique agency and need a complete brand identity kit. Logo, typography, brand guide.",   date: "2025-05-08", read: true  },
  { id: 5, name: "Vikram Malhotra", email: "vikram@tech.io",       service: "WordPress",   budget: "₹10K–₹20K", message: "Need a WooCommerce store for my fashion brand. 100–200 products, payment gateway integration.",   date: "2025-05-07", read: true  },
  { id: 6, name: "Sunita Bedi",     email: "sunita@edu.in",        service: "Web Design",  budget: "₹10K–₹20K", message: "We want a new website for our coaching institute with student portal and admissions form.",       date: "2025-05-06", read: true  },
];

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [selected, setSelected] = useState<typeof INITIAL_MESSAGES[0] | null>(null);

  function markRead(id: number) {
    setMessages((m) => m.map((x) => x.id === id ? { ...x, read: true } : x));
  }

  function deleteMsg(id: number) {
    setMessages((m) => m.filter((x) => x.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  const unread = messages.filter((m) => !m.read).length;

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

      <div className="grid lg:grid-cols-5 gap-4">
        {/* List */}
        <div
          className="lg:col-span-2 flex flex-col divide-y"
          style={{ background: "#1C1C1C", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}
        >
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => { setSelected(msg); markRead(msg.id); }}
              className="flex items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-white/5 w-full"
              style={{ background: selected?.id === msg.id ? "rgba(255,61,0,0.08)" : "transparent", borderLeft: selected?.id === msg.id ? "2px solid #FF3D00" : "2px solid transparent" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-display text-xs font-bold text-white mt-0.5"
                style={{ background: msg.read ? "rgba(255,255,255,0.08)" : "#FF3D00" }}
              >
                {msg.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-body text-sm font-semibold text-white truncate">{msg.name}</p>
                  <span className="font-body text-[10px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>{msg.date.slice(5)}</span>
                </div>
                <p className="font-body text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{msg.service} · {msg.budget}</p>
                <p className="font-body text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{msg.message}</p>
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
              <div className="flex flex-wrap gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {[
                  { label: "Service", value: selected.service },
                  { label: "Budget",  value: selected.budget  },
                  { label: "Date",    value: selected.date     },
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
                <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{selected.message}</p>
              </div>
              {/* Reply */}
              <div className="px-6 pb-6">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.service} Inquiry`}
                  className="flex items-center gap-2 px-5 py-2.5 font-body text-sm font-semibold text-white transition-all"
                  style={{ background: "#FF3D00", borderRadius: "10px", boxShadow: "0 4px 14px rgba(255,61,0,0.3)", display: "inline-flex" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M13 1L1 6l5 2 2 5 5-12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reply via Email
                </a>
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
    </div>
  );
}
