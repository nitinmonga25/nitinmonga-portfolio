"use client";

import { useEffect, useState } from "react";

interface Props { title: string }

const PLATFORMS = [
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877F2",
    getUrl: (url: string, _title: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.093 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    getUrl: (url: string, title: string) => `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    key: "x",
    label: "X / Twitter",
    color: "#000000",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    key: "bluesky",
    label: "Bluesky",
    color: "#0085FF",
    getUrl: (url: string, title: string) =>
      `https://bsky.app/intent/compose?text=${title}%20${url}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
      </svg>
    ),
  },
  {
    key: "pinterest",
    label: "Pinterest",
    color: "#E60023",
    getUrl: (url: string, title: string) =>
      `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
  {
    key: "tumblr",
    label: "Tumblr",
    color: "#35465C",
    getUrl: (url: string, title: string) =>
      `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${url}&title=${title}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.012 1.023.516 1.682 1.508 1.682h.005c.756 0 1.596-.313 2.29-.836l1.917 2.824c-1.388 1.181-3.099 1.913-4.654 1.913z"/>
      </svg>
    ),
  },
];

export function SocialShareBar({ title }: Props) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(encodeURIComponent(window.location.href));
  }, []);

  const encodedTitle = encodeURIComponent(title);

  function handleShare(platform: typeof PLATFORMS[0]) {
    const shareUrl = platform.getUrl(url, encodedTitle);
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=620,height=520");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  if (!url) return null;

  return (
    <div
      className="fixed left-6 z-40 hidden xl:flex flex-col items-center gap-2"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      {/* Share label */}
      <span
        className="font-body text-[9px] font-bold uppercase tracking-[2.5px] mb-1"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          color: "var(--color-muted)",
          letterSpacing: "3px",
        }}
      >
        Share
      </span>

      {/* Divider */}
      <div className="w-px h-6" style={{ background: "var(--color-border)" }} />

      {/* Platform buttons */}
      {PLATFORMS.map((platform) => (
        <button
          key={platform.key}
          onClick={() => handleShare(platform)}
          title={`Share on ${platform.label}`}
          className="group w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-muted)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = platform.color;
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            (e.currentTarget as HTMLButtonElement).style.borderColor = platform.color;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-muted)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
          }}
        >
          {platform.icon}
        </button>
      ))}

      {/* Copy link */}
      <button
        onClick={copyLink}
        title="Copy link"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          background: copied ? "var(--color-accent)" : "var(--color-surface)",
          border: `1px solid ${copied ? "var(--color-accent)" : "var(--color-border)"}`,
          color: copied ? "#fff" : "var(--color-muted)",
        }}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        )}
      </button>

      {/* Bottom divider */}
      <div className="w-px h-6" style={{ background: "var(--color-border)" }} />
    </div>
  );
}
