import type { Metadata } from "next";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { ContactHero } from "@/components/pages/contact/ContactHero";
import { ContactForm } from "@/components/pages/contact/ContactForm";
import type { ContactHeroContent } from "@/components/pages/contact/ContactHero";
import type { ContactFormContent } from "@/components/pages/contact/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string }>("meta.contact");
  return {
    title:       meta.title,
    description: meta.description,
    alternates:  { canonical: `${SITE_URL}/contact-us/` },
    openGraph: {
      title:       meta.title,
      description: meta.description,
      url:         `${SITE_URL}/contact-us/`,
      images:      [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card:        "summary_large_image",
      title:       meta.title,
      description: meta.description,
      images:      [OG_IMAGE],
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
