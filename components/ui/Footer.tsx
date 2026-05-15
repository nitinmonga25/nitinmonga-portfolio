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

// Paths from Simple Icons (simpleicons.org) — brand-accurate, MIT licensed
const SOCIAL_ICONS: Array<{
  key: keyof SocialLinks;
  label: string;
  bg: string;
  path: string;
}> = [
  {
    key: "instagram",
    label: "Instagram",
    bg: "#E1306C",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    bg: "#0A66C2",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    key: "youtube",
    label: "YouTube",
    bg: "#FF0000",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    key: "twitter",
    label: "X",
    bg: "#14171A",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  {
    key: "facebook",
    label: "Facebook",
    bg: "#1877F2",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    key: "behance",
    label: "Behance",
    bg: "#1769FF",
    path: "M7.799 5.698c.589 0 1.12.051 1.606.156.482.103.895.273 1.243.508.344.235.611.547.804.938.192.388.289.871.289 1.444 0 .619-.142 1.143-.425 1.572-.283.43-.7.787-1.25 1.067.755.218 1.317.602 1.689 1.148.369.548.553 1.21.553 1.986 0 .727-.138 1.352-.416 1.872s-.659.948-1.142 1.284c-.483.337-1.043.577-1.682.724-.64.146-1.307.22-2.003.22H.438V5.698h7.361zM7.52 10.56c.506 0 .915-.122 1.222-.368.307-.246.46-.635.46-1.165 0-.284-.05-.522-.15-.707-.1-.185-.238-.335-.413-.45-.176-.115-.375-.194-.598-.237-.222-.044-.459-.066-.704-.066H3.178V10.56H7.52zm.185 5.095c.258 0 .507-.026.745-.08.238-.053.45-.14.635-.26.185-.121.335-.287.45-.496.115-.21.171-.48.171-.806 0-.645-.182-1.103-.548-1.374-.365-.27-.849-.406-1.45-.406H3.178v3.422h4.527zm15.752-2.155c-.338.352-.818.527-1.44.527-.432 0-.793-.098-1.082-.294-.29-.197-.52-.451-.69-.764a3.12 3.12 0 0 1-.352-.888h6.098c0-.234-.01-.44-.028-.618a5.16 5.16 0 0 0-.082-.511 3.68 3.68 0 0 0-.553-1.28 3.3 3.3 0 0 0-.927-.934 4.214 4.214 0 0 0-1.265-.563 5.54 5.54 0 0 0-1.492-.19c-.713 0-1.353.13-1.921.388a4.38 4.38 0 0 0-1.444 1.063 4.667 4.667 0 0 0-.899 1.584 6.066 6.066 0 0 0-.308 1.956c0 .73.112 1.397.335 2.003.223.606.547 1.128.971 1.565.425.437.95.773 1.575 1.008.626.235 1.35.352 2.172.352.62 0 1.178-.098 1.675-.295a4.22 4.22 0 0 0 1.27-.835c.35-.358.617-.785.8-1.279.183-.494.274-1.038.274-1.631h-2.338a2.57 2.57 0 0 1-.186.639zm-5.042-3.838c.202-.234.44-.424.716-.572.275-.147.594-.22.954-.22.329 0 .62.064.871.19.252.128.463.298.635.513.171.214.306.46.403.74.097.279.156.57.179.872H17.75c.08-.569.296-1.05.664-1.523zm-.51-4.587h5.188V5.698H17.9v1.377h.004z",
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
              {(activeSocials.length > 0 ? activeSocials : SOCIAL_ICONS.slice(0, 3)).map(({ key, label, bg, path }) => (
                <a
                  key={key}
                  href={social[key] || "#"}
                  target={social[key] ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ background: bg }}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white" aria-hidden="true">
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
