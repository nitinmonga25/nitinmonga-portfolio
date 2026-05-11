import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { ContactHero } from "@/components/pages/contact/ContactHero";
import { ContactForm } from "@/components/pages/contact/ContactForm";
import type { ContactHeroContent } from "@/components/pages/contact/ContactHero";
import type { ContactFormContent } from "@/components/pages/contact/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string }>("meta.contact");
  return { title: meta.title, description: meta.description };
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
