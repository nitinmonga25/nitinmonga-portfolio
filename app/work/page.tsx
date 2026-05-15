import type { Metadata } from "next";
import { SITE_URL, resolveOg } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { parseTags }  from "@/lib/parseTags";
import { prisma } from "@/lib/prisma";
import { WorkHero } from "@/components/pages/work/WorkHero";
import { WorkGrid } from "@/components/pages/work/WorkGrid";
import type { WorkHeroContent } from "@/components/pages/work/WorkHero";
import type { WorkProject } from "@/components/pages/work/WorkGrid";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string; ogImage?: string }>("meta.work");
  const ogImage = resolveOg(meta?.ogImage);
  return {
    title:       meta.title,
    description: meta.description,
    alternates:  { canonical: `${SITE_URL}/work/` },
    openGraph: {
      title:       meta.title,
      description: meta.description,
      url:         `${SITE_URL}/work/`,
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

export default async function WorkPage() {
  const [hero, rawProjects] = await Promise.all([
    getContent<WorkHeroContent>("content.work.hero"),
    prisma.project.findMany({
      where:   { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      select:  { title: true, slug: true, category: true, tags: true, thumbnail: true, createdAt: true },
    }).catch(() => []),
  ]);

  const projects: WorkProject[] = rawProjects.map((p) => ({
    title:     p.title,
    slug:      p.slug,
    category:  p.category,
    tags:      parseTags(p.tags),
    thumbnail: p.thumbnail || null,
    year:      new Date(p.createdAt).getFullYear().toString(),
  }));

  return (
    <>
      <WorkHero content={hero} />
      <WorkGrid projects={projects} />
    </>
  );
}
