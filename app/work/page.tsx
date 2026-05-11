import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { WorkHero } from "@/components/pages/work/WorkHero";
import { WorkGrid } from "@/components/pages/work/WorkGrid";
import type { WorkHeroContent } from "@/components/pages/work/WorkHero";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string }>("meta.work");
  return { title: meta.title, description: meta.description };
}

export default async function WorkPage() {
  const hero = await getContent<WorkHeroContent>("content.work.hero");

  return (
    <>
      <WorkHero content={hero} />
      <WorkGrid />
    </>
  );
}
