export const revalidate = 300;

import { getContent } from "@/lib/content";
import { parseTags }  from "@/lib/parseTags";
import { prisma }     from "@/lib/prisma";
import { Hero }        from "@/components/sections/Hero";
import { Stats }       from "@/components/sections/Stats";
import { About }       from "@/components/sections/About";
import { Services }    from "@/components/sections/Services";
import { Work }        from "@/components/sections/Work";
import type { WorkProject } from "@/components/sections/Work";
import { BlogPreview } from "@/components/sections/BlogPreview";
import type { BlogPostPreview } from "@/components/sections/BlogPreview";
import { Distributions } from "@/components/sections/Distributions";
import { ClientLogos }   from "@/components/sections/ClientLogos";
import type { ClientLogo } from "@/components/sections/ClientLogos";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact }     from "@/components/sections/Contact";
import type { HeroContent } from "@/components/sections/Hero";
import type { StatItem }    from "@/components/sections/Stats";
import type { AboutContent } from "@/components/sections/About";
import type { ContactContent } from "@/components/sections/Contact";
import type { TestimonialItem } from "@/components/sections/Testimonials";

export default async function HomePage() {
  const [hero, stats, about, services, testimonials, contact, clients, rawProjects, rawPosts] = await Promise.all([
    getContent<HeroContent>("content.home.hero"),
    getContent<StatItem[]>("content.home.stats"),
    getContent<AboutContent>("content.home.about"),
    getContent<{ services: Array<{ title: string; description: string }> }>("content.home.services"),
    getContent<TestimonialItem[]>("content.home.testimonials"),
    getContent<ContactContent>("content.home.contact"),
    getContent<ClientLogo[]>("content.home.clients"),
    prisma.project.findMany({
      where:   { published: true },
      orderBy: { order: "asc" },
      select:  { title: true, slug: true, category: true, tags: true, thumbnail: true },
    }).catch(() => []),
    prisma.blogPost.findMany({
      where:   { published: true },
      orderBy: { publishedAt: "desc" },
      take:    3,
      select:  { slug: true, category: true, title: true, excerpt: true, publishedAt: true, readTime: true, thumbnail: true },
    }).catch(() => []),
  ]);

  const projects: WorkProject[] = rawProjects.map((p) => ({
    title:     p.title,
    slug:      p.slug,
    category:  p.category,
    tags:      parseTags(p.tags),
    thumbnail: p.thumbnail || undefined,
  }));

  const blogPosts: BlogPostPreview[] = rawPosts.map((p) => ({
    slug:      p.slug,
    category:  p.category,
    title:     p.title,
    excerpt:   p.excerpt ?? "",
    date:      p.publishedAt
      ? new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "",
    readTime:  p.readTime ? `${p.readTime} min` : "",
    thumbnail: p.thumbnail || undefined,
  }));

  return (
    <>
      <Hero content={hero} />
      <Stats content={stats} />
      <Distributions />
      <About content={about} />
      <Services content={services} />
      <Work projects={projects.length > 0 ? projects : undefined} />
      <ClientLogos logos={clients ?? []} />
      <Testimonials content={testimonials} />
      <BlogPreview posts={blogPosts.length > 0 ? blogPosts : undefined} />
      <Contact content={contact} />
    </>
  );
}
