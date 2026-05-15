import type { Metadata } from "next";
import { SITE_URL, resolveOg } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { ContactHero } from "@/components/pages/contact/ContactHero";
import { ContactForm } from "@/components/pages/contact/ContactForm";
import type { ContactHeroContent } from "@/components/pages/contact/ContactHero";
import type { ContactFormContent } from "@/components/pages/contact/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string; ogImage?: string }>("meta.contact");
  const ogImage = resolveOg(meta?.ogImage);
  return {
    title:       meta.title,
    description: meta.description,
    alternates:  { canonical: `${SITE_URL}/contact-us/` },
    openGraph: {
      title:       meta.title,
      description: meta.description,
      url:         `${SITE_URL}/contact-us/`,
      images:      [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card:        "summary_large_image",
      title:       meta.title,
      description: meta.description,
      images:      [ogImage],
    },
  };
}

export default async function ContactPage() {
  const [hero, form] = await Promise.all([
    getContent<ContactHeroContent>("content.contact.hero"),
    getContent<ContactFormContent>("content.contact.form"),
  ]);

  return (
    <>
      <ContactHero content={hero} />
      <ContactForm content={form} />
    </>
  );
}
