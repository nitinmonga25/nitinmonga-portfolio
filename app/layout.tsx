import type { Metadata } from "next";
import Script from "next/script";
import { bricolage } from "@/lib/fonts";
import { SiteLayout } from "@/components/ui/SiteLayout";
import { Footer } from "@/components/ui/Footer";
import { FooterWrapper } from "@/components/ui/FooterWrapper";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

async function getFaviconUrl(): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: "meta.favicon" } });
    return row?.value || "/favicon.ico";
  } catch {
    return "/favicon.ico";
  }
}

async function getHomeOgImage(): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: "meta.home" } });
    if (row?.value) {
      const parsed = JSON.parse(row.value) as { ogImage?: string };
      if (parsed.ogImage?.trim()) return parsed.ogImage.trim();
    }
  } catch { /* fall through */ }
  return "https://assets.nitinmonga.in/og-default.jpg";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const personImage = await getHomeOgImage();

  const PERSON_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nitin Monga",
    url: "https://nitinmonga.in",
    image: personImage,
    jobTitle: "Graphic Designer, 3D Artist & Full-Stack Developer",
    address: { "@type": "PostalAddress", addressRegion: "Punjab", addressCountry: "IN" },
    sameAs: [
      "https://www.behance.net/nitinmonga",
      "https://www.instagram.com/nitinmonga14",
      "https://www.linkedin.com/in/nitinmonga14/",
      "https://www.youtube.com/tutorialsbynitin",
    ],
  };

  return (
    <html
      lang="en"
      className={bricolage.variable}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5308405517093129" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
        <SiteLayout>{children}</SiteLayout>
        <FooterWrapper><Footer /></FooterWrapper>
      </body>
    </html>
  );
}
