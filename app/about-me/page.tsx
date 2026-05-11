export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { AboutHero }     from "@/components/pages/about/AboutHero";
import { AboutBio }      from "@/components/pages/about/AboutBio";
import { AboutSkills }   from "@/components/pages/about/AboutSkills";
import { AboutTimeline } from "@/components/pages/about/AboutTimeline";
import type { AboutHeroContent }     from "@/components/pages/about/AboutHero";
import type { AboutBioContent }      from "@/components/pages/about/AboutBio";
import type { AboutSkillsContent }   from "@/components/pages/about/AboutSkills";
import type { AboutTimelineContent } from "@/components/pages/about/AboutTimeline";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string }>("meta.about");
  return { title: meta.title, description: meta.description };
}

export default async function AboutPage() {
  const [hero, bio, skills, timeline] = await Promise.all([
    getContent<AboutHeroContent>("content.about.hero"),
    getContent<AboutBioContent>("content.about.bio"),
    getContent<AboutSkillsContent>("content.about.skills"),
    getContent<AboutTimelineContent>("content.about.timeline"),
  ]);

  return (
    <>
      <AboutHero content={hero} />
      <AboutBio content={bio} />
      <AboutSkills content={skills} />
      <AboutTimeline content={timeline} />
    </>
  );
}
