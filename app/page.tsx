export const revalidate = 300;

import { getContent } from "@/lib/content";
import { Hero }        from "@/components/sections/Hero";
import { Stats }       from "@/components/sections/Stats";
import { About }       from "@/components/sections/About";
import { Services }    from "@/components/sections/Services";
import { Work }        from "@/components/sections/Work";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact }     from "@/components/sections/Contact";
import type { HeroContent } from "@/components/sections/Hero";
import type { StatItem }    from "@/components/sections/Stats";
import type { AboutContent } from "@/components/sections/About";
import type { ContactContent } from "@/components/sections/Contact";
import type { TestimonialItem } from "@/components/sections/Testimonials";

export default async function HomePage() {
  const [hero, stats, about, services, testimonials, contact] = await Promise.all([
    getContent<HeroContent>("content.home.hero"),
    getContent<StatItem[]>("content.home.stats"),
    getContent<AboutContent>("content.home.about"),
    getContent<{ services: Array<{ title: string; description: string }> }>("content.home.services"),
    getContent<TestimonialItem[]>("content.home.testimonials"),
    getContent<ContactContent>("content.home.contact"),
  ]);

  return (
    <>
      <Hero content={hero} />
      <Stats content={stats} />
      <About content={about} />
      <Services content={services} />
      <Work />
      <Testimonials content={testimonials} />
      <BlogPreview />
      <Contact content={contact} />
    </>
  );
}
