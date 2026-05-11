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

const SOCIAL_ICONS: Array<{
  key: keyof SocialLinks;
  label: string;
  path: string;
}> = [
  {
    key: "instagram",
    label: "Instagram",
    path: "M12 2c2.8 0 3.1 0 4.2.1 2.8.1 4.1 1.5 4.2 4.2.1 1.1.1 1.4.1 4.2s0 3.1-.1 4.2c-.1 2.7-1.4 4.1-4.2 4.2-1.1.1-1.4.1-4.2.1s-3.1 0-4.2-.1C5 18.5 3.6 17.1 3.5 14.4 3.4 13.3 3.4 13 3.4 12s0-3.1.1-4.2C3.6 5 5 3.5 7.8 3.5 8.9 3.4 9.2 3.4 12 3.4zm0 1.8c-2.7 0-3 0-4.1.1-1.9.1-2.8 1-2.9 2.9-.1 1.1-.1 1.4-.1 4.1s0 3 .1 4.1c.1 1.9 1 2.8 2.9 2.9 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c1.9-.1 2.8-1 2.9-2.9.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-1.9-1-2.8-2.9-2.9-1.1-.1-1.4-.1-4.1-.1zM12 7a5 5 0 100 10A5 5 0 0012 7zm0 1.8a3.2 3.2 0 110 6.4 3.2 3.2 0 010-6.4zm5.2-3.2a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
  },
  {
    key: "youtube",
    label: "YouTube",
    path: "M22.54 6.42A2.78 2.78 0 0020.61 4.5C18.88 4 12 4 12 4s-6.88 0-8.61.46A2.78 2.78 0 001.46 6.42 29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.39 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.61-.46a2.78 2.78 0 001.93-1.9A29 29 0 0023 11.75a29 29 0 00-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
  },
  {
    key: "twitter",
    label: "X / Twitter",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    key: "facebook",
    label: "Facebook",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.093 24 18.1 24 12.073z",
  },
  {
    key: "behance",
    label: "Behance",
    path: "M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.726zm-7.726-3h3.457c-.073-1.580-1.033-2.08-1.739-2.08-.799 0-1.541.433-1.718 2.08zm-12 3.806c.338.636 1.045 1.194 2.254 1.194 1.345 0 2.035-.568 2.035-1.449 0-.92-.778-1.255-1.947-1.55l-.765-.198c-1.865-.495-3.557-1.238-3.557-3.446 0-2.198 1.904-3.357 4.22-3.357 1.893 0 3.618.745 4.246 2.39l-1.83.829c-.307-.715-1.004-1.164-2.099-1.164-1.02 0-1.786.416-1.786 1.266 0 .818.68 1.087 1.779 1.374l.82.218c2.125.562 3.727 1.375 3.727 3.585 0 2.064-1.735 3.497-4.374 3.497-2.004 0-3.723-.715-4.434-2.198L3 17.806z",
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
