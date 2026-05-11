import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { BlogHero } from "@/components/pages/blog/BlogHero";
import { BlogList } from "@/components/pages/blog/BlogList";
import type { BlogHeroContent } from "@/components/pages/blog/BlogHero";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string }>("meta.blog");
  return { title: meta.title, description: meta.description };
}

export default async function BlogPage() {
  const hero = await getContent<BlogHeroContent>("content.blog.hero");

  return (
    <>
      <BlogHero content={hero} />
      <BlogList />
    </>
  );
}
