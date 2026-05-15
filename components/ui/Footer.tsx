import Link from "next/link";
import { getContent } from "@/lib/content";

const FOOTER_LINKS = {
  Pages: [
    { label: "About Me",  href: "/about-me/"  },
    { label: "Services",  href: "/services/"  },
    { label: "Work",      href: "/work/"       },
    { label: "Blog",      href: "/blog/"       },
    { label: "Contact",   href: "/contact-us/" },
  ],
  Legal: [
    { label: "Terms & Conditions", href: "/terms-conditions/" },
    { label: "Privacy Policy",     href: "/privacy-policy/"  },
  ],
};

const MARQUEE_TEXT =
  "Nitin Monga · Graphic Designer · 3D Artist · Full-Stack Developer · Punjab India · ";

interface SocialLinks {
  instagram: string;
  linkedin: string;
  youtube: string;
  twitter: string;
  facebook: string;
  behance: string;
}

// Paths sourced from Simple Icons (simpleicons.org) — brand-accurate, MIT licensed
const SOCIAL_ICONS: Array<{
  key: keyof SocialLinks;
  label: string;
  path: string;
}> = [
  {
    key: "instagram",
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    key: "youtube",
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    key: "twitter",
    label: "X",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  {
    key: "facebook",
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    key: "behance",
    label: "Behance",
    path: "M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.598.413.27.735.63.96 1.08.225.45.34.99.34 1.625 0 .697-.157 1.284-.47 1.762-.313.477-.768.882-1.364 1.212.823.24 1.44.67 1.85 1.287.41.617.615 1.365.615 2.244 0 .69-.13 1.294-.39 1.806-.262.514-.627.94-1.1 1.28-.47.344-1.01.598-1.615.764-.606.166-1.252.25-1.94.25H0V4.51h6.938v-.007zm9.546.45c1.67 0 3.03.47 4.077 1.414C21.562 7.31 22.083 8.7 22.083 10.54c0 .218-.008.43-.025.637h-8.12c.063.855.35 1.51.858 1.964.508.453 1.146.68 1.913.68.59 0 1.11-.14 1.558-.42.449-.282.755-.662.92-1.138h2.752c-.282.977-.82 1.784-1.616 2.421-.796.637-1.822.956-3.079.956-1.015 0-1.914-.222-2.697-.665-.783-.443-1.39-1.07-1.823-1.88-.432-.812-.648-1.757-.648-2.837 0-1.072.207-2.01.62-2.812.415-.803 1.002-1.428 1.762-1.874.76-.447 1.643-.67 2.648-.67zM6.586 13.777c.413 0 .75-.054 1.01-.16.26-.107.48-.26.658-.46.178-.2.315-.44.41-.724.096-.282.144-.596.144-.942 0-.67-.193-1.177-.58-1.519-.386-.342-.94-.513-1.66-.513H2.544v4.318h4.042zm9.792-6.667c-.672 0-1.218.188-1.638.565-.42.377-.67.916-.75 1.617h4.72c-.04-.71-.27-1.25-.69-1.62-.42-.368-.97-.553-1.642-.553v-.01zm-9.904-.72c.333 0 .608-.045.826-.135.217-.09.39-.21.517-.36.126-.15.216-.32.268-.51.054-.19.08-.39.08-.6 0-.44-.14-.79-.42-1.05-.28-.26-.72-.39-1.32-.39H2.544V6.39h3.93z",
  },
];

export async function Footer() {
  const social = await getContent<SocialLinks>("content.footer.social");

  const activeSocials = SOCIAL_ICONS.filter((s) => !!social[s.key]);

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-bg)]">

      {/* Marquee strip */}
      <div className="border-b border-white/10 overflow-hidden py-5">
        <div className="marquee-track whitespace-nowrap select-none">
          {Array.from({ length: 4 }, (_, i) => (
            <span
              key={i}
              className="font-display font-bold text-[clamp(28px,4vw,52px)] text-white/10 px-6"
              aria-hidden={i > 0}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12">

          {/* Brand col */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-2xl font-bold text-white">NM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true"/>
            </div>
            <p className="font-body text-[14px] text-white/50 leading-relaxed max-w-xs">
              Graphic Designer, 3D Artist &amp; Full-Stack Developer.<br/>
              Based in Punjab, India.
            </p>
            {/* Social icons */}
            <div className="flex flex-wrap gap-2.5 mt-1">
              {(activeSocials.length > 0 ? activeSocials : SOCIAL_ICONS.slice(0, 3)).map(({ key, label, path }) => (
                <a
                  key={key}
                  href={social[key] || "#"}
                  target={social[key] ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/50 transition-colors duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={path}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Pages column */}
          <div>
            <p className="font-body text-[11px] uppercase tracking-[2.5px] text-[var(--color-accent)] mb-5">Pages</p>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.Pages.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="font-body text-[14px] text-white/50 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <p className="font-body text-[11px] uppercase tracking-[2.5px] text-[var(--color-accent)] mb-5">Legal</p>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.Legal.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="font-body text-[14px] text-white/50 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-[13px] text-white/30">
            © {new Date().getFullYear()} Nitin Monga. All rights reserved.
          </p>
          <p className="font-body text-[13px] text-white/30">
            nitinmonga.in — Designed &amp; Developed by Nitin Monga
          </p>
        </div>
      </div>
    </footer>
  );
}
