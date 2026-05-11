export const dynamic = "force-dynamic";

import { getContent } from "@/lib/content";
import { Hero }        from "@/components/sections/Hero";
import { Stats }       from "@/components/sections/Stats";
import { About }       from "@/components/sections/About";
import { Services }    from "@/components/sections/Services";
import { Work }        from "@/components/sections/Work";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { Contact }     from "@/components/sections/Contact";
import type { HeroContent } from "@/components/sections/Hero";
import type { StatItem }    from "@/components/sections/Stats";
import type { AboutContent } from "@/components/sections/About";
import type { ContactContent } from "@/components/sections/Contact";

export default async function HomePage() {
  const [hero, stats, about, services, contact] = await Promise.all([
    getContent<HeroContent>("content.home.hero"),
    getContent<StatItem[]>("content.home.stats"),
    getContent<AboutContent>("content.home.about"),
    getContent<{ services: Array<{ title: string; description: string }> }>("content.home.services"),
    getContent<ContactContent>("content.home.contact"),
  ]);

  return (
    <>
      <Hero content={hero} />
      <Stats content={stats} />
      <About content={about} />
      <Services content={services} />
      <Work />
      <BlogPreview />
      <Contact content={contact} />
    </>
  );
}
