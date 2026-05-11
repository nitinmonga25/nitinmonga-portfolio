import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       "var(--color-bg)",
        ink:      "var(--color-ink)",
        accent:   "var(--color-accent)",
        "accent-dark":  "var(--color-accent-dark)",
        "accent-light": "var(--color-accent-light)",
        /* legacy aliases */
        gold:        "var(--color-accent)",
        "gold-dark": "var(--color-accent-dark)",
        "gold-light":"var(--color-accent-light)",
        muted:    "var(--color-muted)",
        border:   "var(--color-border)",
        surface:  "var(--color-surface)",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "Bricolage Grotesque", "sans-serif"],
        body:    ["var(--font-bricolage)", "Bricolage Grotesque", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(64px, 8vw, 128px)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "section": ["clamp(40px, 5vw, 64px)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "sub": ["clamp(20px, 2.5vw, 28px)", { lineHeight: "1.3" }],
        "label": ["11px", { lineHeight: "1", letterSpacing: "3px" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "section": "clamp(80px, 10vw, 140px)",
      },
      maxWidth: {
        "site": "1440px",
        "content": "1200px",
      },
      animation: {
        "marquee": "marquee 28s linear infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      backdropBlur: {
        nav: "20px",
      },
      borderRadius: {
        card: "20px",
      },
      boxShadow: {
        card:       "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        "card-hover":"0 2px 8px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.10)",
        gold:       "0 4px 16px rgba(255,61,0,0.35)",
        accent:     "0 4px 16px rgba(255,61,0,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
