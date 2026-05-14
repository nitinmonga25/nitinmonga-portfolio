import type { Metadata } from "next";
import { bricolage } from "@/lib/fonts";
import { SiteLayout } from "@/components/ui/SiteLayout";
import { Footer } from "@/components/ui/Footer";
import { FooterWrapper } from "@/components/ui/FooterWrapper";
import { prisma } from "@/lib/prisma";
import "./globals.css";

async function getFaviconUrl(): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: "meta.favicon" } });
    return row?.value || "/favicon.ico";
  } catch {
    return "/favicon.ico";
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getFaviconUrl();
  return {
    title: {
      default: "Nitin Monga — Graphic Designer & Full-Stack Developer | Punjab India",
      template: "%s | Nitin Monga",
    },
    description:
      "Nitin Monga — Graphic Designer, 3D Artist & Full-Stack Developer from Punjab, India. 10+ years building websites, CGI ads, and digital platforms.",
    keywords: [
      "Nitin Monga",
      "graphic designer Punjab",
      "full stack developer India",
      "Next.js developer",
      "WordPress developer",
      "3D CGI artist",
      "web design Punjab",
    ],
    authors: [{ name: "Nitin Monga", url: "https://nitinmonga.in" }],
    creator: "Nitin Monga",
    icons: { icon: faviconUrl },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://nitinmonga.in",
      siteName: "Nitin Monga",
      title: "Nitin Monga — Graphic Designer & Full-Stack Developer | Punjab India",
      description:
        "10+ years building digital products. 400+ websites, 40+ CGI ads, 84K+ followers. Based in Punjab, India.",
      images: [{ url: "https://assets.nitinmonga.in/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nitin Monga — Graphic Designer & Full-Stack Developer",
      description: "10+ years building digital products that perform and last.",
      images: ["https://assets.nitinmonga.in/og-default.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    // verification: { google: "PASTE_SEARCH_CONSOLE_TOKEN_HERE" },
  };
}

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nitin Monga",
  url: "https://nitinmonga.in",
  description: "Graphic Designer, 3D Artist & Full-Stack Developer from Punjab, India.",
  author: { "@type": "Person", name: "Nitin Monga" },
};

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nitin Monga",
  url: "https://nitinmonga.in",
  image: "https://assets.nitinmonga.in/og-default.jpg",
  jobTitle: "Graphic Designer, 3D Artist & Full-Stack Developer",
  worksFor: { "@type": "Organization", name: "Xdecoders" },
  address: { "@type": "PostalAddress", addressRegion: "Punjab", addressCountry: "IN" },
  sameAs: [
    "https://www.instagram.com/nitinmonga",
    "https://www.linkedin.com/in/nitinmonga",
    "https://www.youtube.com/@nitinmonga",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={bricolage.variable}
    >
      <body className="antialiased" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
        <SiteLayout>{children}</SiteLayout>
        <FooterWrapper><Footer /></FooterWrapper>
      </body>
    </html>
  );
}
