import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { BlogPageContent } from "@/components/pages/blog/BlogPageContent";
import type { BlogHeroContent } from "@/components/pages/blog/BlogHero";
import type { BlogPostItem } from "@/components/pages/blog/BlogPageContent";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent<{ title: string; description: string }>("meta.blog");
  return { title: meta.title, description: meta.description };
}

export default async function BlogPage() {
  const [hero, rawPosts] = await Promise.all([
    getContent<BlogHeroContent>("content.blog.hero"),
    prisma.blogPost.findMany({
      where:   { published: true },
      orderBy: { publishedAt: "desc" },
      select:  { slug: true, category: true, title: true, excerpt: true, publishedAt: true, readTime: true, thumbnail: true },
    }).catch(() => []),
  ]);

  const posts: BlogPostItem[] = rawPosts.map((p) => ({
    slug:      p.slug,
    category:  p.category,
    title:     p.title,
    excerpt:   p.excerpt,
    thumbnail: p.thumbnail,
    readTime:  `${p.readTime} min`,
    date:      p.publishedAt
      ? new Date(p.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "",
  }));

  return (
    <BlogPageContent
      posts={posts}
      heroTitle={hero.title}
      heroSubtitle={hero.subtitle}
    />
  );
}
