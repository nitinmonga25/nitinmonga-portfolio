import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic  = "force-dynamic";
export const revalidate = 3600; // re-generate at most once per hour

const BASE = "https://nitinmonga.in";

const STATIC: MetadataRoute.Sitemap = [
  { url: `${BASE}/`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/about-me/`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/services/`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/work/`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
  { url: `${BASE}/blog/`,       lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE}/contact-us/`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
  { url: `${BASE}/tools/`,                                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8  },
  { url: `${BASE}/tools/ui-analyzer/`,                        lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE}/tools/color-palette-generator-extractor/`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE}/tools/qr-studio/`,                          lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE}/terms-conditions/`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE}/privacy-policy/`,   lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];

async function getProjects(): Promise<MetadataRoute.Sitemap> {
  try {
    const rows = await prisma.project.findMany({
      where:   { published: true },
      select:  { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map((p) => ({
      url:             `${BASE}/work/${p.slug}/`,
      lastModified:    p.updatedAt,
      changeFrequency: "monthly" as const,
      priority:        0.7,
    }));
  } catch {
    return [];
  }
}

async function getPosts(): Promise<MetadataRoute.Sitemap> {
  try {
    const rows = await prisma.blogPost.findMany({
      where:   { published: true },
      select:  { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map((p) => ({
      url:             `${BASE}/blog/${p.slug}/`,
      lastModified:    p.updatedAt,
      changeFrequency: "monthly" as const,
      priority:        0.75,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectUrls, postUrls] = await Promise.all([getProjects(), getPosts()]);
  return [...STATIC, ...projectUrls, ...postUrls];
}
