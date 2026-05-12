import type { Metadata } from "next";
import { bricolage } from "@/lib/fonts";
import { SiteLayout } from "@/components/ui/SiteLayout";
import { Footer } from "@/components/ui/Footer";
import { FooterWrapper } from "@/components/ui/FooterWrapper";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={bricolage.variable}
    >
      <body className="antialiased" suppressHydrationWarning>
        <SiteLayout>{children}</SiteLayout>
        <FooterWrapper><Footer /></FooterWrapper>
      </body>
    </html>
  );
}
