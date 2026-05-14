"use client";

import { useState, useEffect, useCallback } from "react";

interface Props {
  images: string[];
  title:  string;
}

export function ProjectGallery({ images, title }: Props) {
  const [active,    setActive]    = useState(0);
  const [lightbox,  setLightbox]  = useState(false);
  const [lightIdx,  setLightIdx]  = useState(0);

  const prev = useCallback((idx: number, total: number) => (idx - 1 + total) % total, []);
  const next = useCallback((idx: number, total: number) => (idx + 1) % total, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft")  setLightIdx((i) => prev(i, images.length));
      if (e.key === "ArrowRight") setLightIdx((i) => next(i, images.length));
      if (e.key === "Escape")     setLightbox(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length, prev, next]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  function openLightbox(i: number) {
    setLightIdx(i);
    setLightbox(true);
  }

  return (
    <>
      {/* ── Main viewer ─────────────────────────────────────────────── */}
      <div className="relative w-full rounded-[16px] overflow-hidden bg-[var(--color-surface)]" style={{ aspectRatio: "16/9" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`${title} — image ${active + 1}`}
          className="w-full h-full object-cover cursor-zoom-in transition-opacity duration-300"
          onClick={() => openLightbox(active)}
        />

        {/* Counter */}
        <div
          className="absolute top-3 right-3 font-mono text-[11px] px-2.5 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(6px)" }}
        >
          {active + 1} / {images.length}
        </div>

        {/* Expand icon */}
        <button
          onClick={() => openLightbox(active)}
          className="absolute bottom-3 right-3 p-2 rounded-lg transition-colors"
          style={{ background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(6px)" }}
          title="View fullscreen"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((i) => prev(i, images.length))}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110"
              style={{ background: "rgba(0,0,0,0.5)", color: "white", backdropFilter: "blur(6px)" }}
              aria-label="Previous image"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => setActive((i) => next(i, images.length))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110"
              style={{ background: "rgba(0,0,0,0.5)", color: "white", backdropFilter: "blur(6px)" }}
              aria-label="Next image"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ─────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex-shrink-0 rounded-[10px] overflow-hidden transition-all duration-200"
              style={{
                width: 72, height: 48,
                outline: i === active ? "2px solid var(--color-accent)" : "2px solid transparent",
                outlineOffset: "2px",
                opacity: i === active ? 1 : 0.5,
              }}
              aria-label={`Go to image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightbox(false)}
        >
          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightIdx]}
              alt={`${title} — image ${lightIdx + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-[12px]"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
            />

            {/* Counter */}
            <div
              className="absolute top-3 left-3 font-mono text-[11px] px-2.5 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)" }}
            >
              {lightIdx + 1} / {images.length}
            </div>

            {/* Close */}
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-3 right-3 p-2 rounded-full transition-colors hover:bg-white/20"
              style={{ background: "rgba(0,0,0,0.5)", color: "white" }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Prev / Next in lightbox */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightIdx((i) => prev(i, images.length)); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 4L7 10l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightIdx((i) => next(i, images.length)); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                aria-label="Next"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
