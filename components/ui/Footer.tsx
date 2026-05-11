import Link from "next/link";

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
  Social: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn",  href: "#" },
    { label: "YouTube",   href: "#" },
    { label: "Twitter/X", href: "#" },
  ],
};

const MARQUEE_TEXT =
  "Nitin Monga · Graphic Designer · 3D Artist · Full-Stack Developer · Punjab India · ";

export function Footer() {
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
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">

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
            <div className="flex gap-2.5 mt-1">
              {[
                { label: "Instagram", path: "M12 2c2.8 0 3.1 0 4.2.1 2.8.1 4.1 1.5 4.2 4.2.1 1.1.1 1.4.1 4.2s0 3.1-.1 4.2c-.1 2.7-1.4 4.1-4.2 4.2-1.1.1-1.4.1-4.2.1s-3.1 0-4.2-.1C5 18.5 3.6 17.1 3.5 14.4 3.4 13.3 3.4 13 3.4 12s0-3.1.1-4.2C3.6 5 5 3.5 7.8 3.5 8.9 3.4 9.2 3.4 12 3.4zm0 1.8c-2.7 0-3 0-4.1.1-1.9.1-2.8 1-2.9 2.9-.1 1.1-.1 1.4-.1 4.1s0 3 .1 4.1c.1 1.9 1 2.8 2.9 2.9 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c1.9-.1 2.8-1 2.9-2.9.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-1.9-1-2.8-2.9-2.9-1.1-.1-1.4-.1-4.1-.1zM12 7a5 5 0 100 10A5 5 0 0012 7zm0 1.8a3.2 3.2 0 110 6.4 3.2 3.2 0 010-6.4zm5.2-3.2a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" },
                { label: "LinkedIn",  path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" },
                { label: "YouTube",   path: "M22.54 6.42A2.78 2.78 0 0020.61 4.5C18.88 4 12 4 12 4s-6.88 0-8.61.46A2.78 2.78 0 001.46 6.42 29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.39 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.61-.46a2.78 2.78 0 001.93-1.9A29 29 0 0023 11.75a29 29 0 00-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
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

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="font-body text-[11px] uppercase tracking-[2.5px] text-[var(--color-accent)] mb-5">
                {group}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-body text-[14px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
