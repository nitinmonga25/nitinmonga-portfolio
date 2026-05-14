import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://nitinmonga.in";

const STATIC: MetadataRoute.Sitemap = [
  { url: `${BASE}/`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/about-me/`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/services/`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/work/`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
  { url: `${BASE}/blog/`,       lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE}/contact-us/`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
  { url: `${BASE}/tools/`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/tools/ui-analyzer/`,                          lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE}/tools/color-palette-generator-extractor/`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [projects, posts] = await Promise.all([
      prisma.project.findMany({
        where:   { published: true },
        select:  { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.blogPost.findMany({
        where:   { published: true },
        select:  { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
      url:             `${BASE}/work/${p.slug}/`,
      lastModified:    p.updatedAt,
      changeFrequency: "monthly",
      priority:        0.7,
    }));

    const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
      url:             `${BASE}/blog/${p.slug}/`,
      lastModified:    p.updatedAt,
      changeFrequency: "monthly",
      priority:        0.75,
    }));

    return [...STATIC, ...projectUrls, ...postUrls];
  } catch {
    return STATIC;
  }
}
