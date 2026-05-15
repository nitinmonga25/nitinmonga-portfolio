export const revalidate = 86400;

import type { Metadata } from "next";
import { SITE_URL, resolveOg } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { ServicesHero }    from "@/components/pages/services/ServicesHero";
import { ServicesGrid }    from "@/components/pages/services/ServicesGrid";
import { ServicesFaq }     from "@/components/pages/services/ServicesFaq";
import { ServicesProcess } from "@/components/pages/services/ServicesProcess";
import type { ServicesHeroContent }    from "@/components/pages/services/ServicesHero";
import type { ServicesProcessContent } from "@/components/pages/services/ServicesProcess";
import type { ServicesFaqContent }     from "@/components/pages/services/ServicesFaq";
import type { ServiceCard }            from "@/components/pages/services/ServicesGrid";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string; ogImage?: string }>("meta.services");
  const ogImage = resolveOg(meta?.ogImage);
  return {
    title:       meta.title,
    description: meta.description,
    alternates:  { canonical: `${SITE_URL}/services/` },
    openGraph: {
      title:       meta.title,
      description: meta.description,
      url:         `${SITE_URL}/services/`,
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

export default async function ServicesPage() {
  const [hero, grid, process_, faq] = await Promise.all([
    getContent<ServicesHeroContent>("content.services.hero"),
    getContent<{ services: ServiceCard[] }>("content.services.grid"),
    getContent<ServicesProcessContent>("content.services.process"),
    getContent<ServicesFaqContent>("content.services.faq"),
  ]);

  return (
    <>
      <ServicesHero content={hero} />
      <ServicesGrid content={grid} />
      <ServicesProcess content={process_} />
      <ServicesFaq content={faq} />
    </>
  );
}
