"use client";

import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder = "nitinmonga", label = "Image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      // 1. Get signature from our API
      const sigRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      const sig = await sigRes.json();
      if (!sig.ok) throw new Error(sig.error);

      // 2. Upload directly to Cloudinary
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", sig.timestamp);
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form }
      );
      const data = await uploadRes.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        throw new Error(data.error?.message ?? "Upload failed");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs transition-colors"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Drop zone / URL input */}
      <div
        className="flex flex-col gap-2 p-4 rounded-xl text-center cursor-pointer transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.12)" }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        {uploading ? (
          <p className="font-body text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>Uploading…</p>
        ) : (
          <>
            <p className="font-body text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              Drop image here or <span style={{ color: "#FF3D00" }}>browse</span>
            </p>
            <p className="font-body text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>JPG, PNG, WebP — max 10MB</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* Manual URL input */}
      <input
        type="text"
        placeholder="Or paste image URL…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-body text-[13px] px-3 py-2 rounded-lg outline-none"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
      />

      {error && <p className="font-body text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
