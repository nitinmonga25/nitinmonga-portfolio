export const revalidate = 3600;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { prisma }    from "@/lib/prisma";
import { parseTags } from "@/lib/parseTags";
import { ReadingProgress } from "@/components/pages/blog/ReadingProgress";
import { TableOfContents } from "@/components/pages/blog/TableOfContents";
import { SocialShareBar } from "@/components/pages/blog/SocialShareBar";

interface Props { params: { slug: string } }

function buildHtml(content: string): string {
  // TipTap outputs HTML (starts with a tag); legacy posts may be markdown
  const raw = content.trim().startsWith("<")
    ? content
    : (marked(content || "") as string);
  return raw.replace(/<h([23])>(.+?)<\/h\1>/g, (_, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, "");
    const id = text.toLowerCase().replace(/[^\w\s]/g, "").trim().replace(/\s+/g, "-");
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
}

function extractHeadings(html: string): Array<{ id: string; text: string; level: number }> {
  const out: Array<{ id: string; text: string; level: number }> = [];
  const re = /<h([23]) id="([^"]+)">(.+?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    out.push({ level: +m[1], id: m[2], text: m[3].replace(/<[^>]+>/g, "") });
  }
  return out;
}

async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findUnique({ where: { slug, published: true } });
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title:       post.seoTitle ?? post.title,
    description: post.seoDesc  ?? post.excerpt,
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const html     = buildHtml(post.content || "");
  const headings = extractHeadings(html);
  const tags: string[] = parseTags(post.tags);
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle ?? post.title,
    description: post.seoDesc ?? post.excerpt,
    author: { "@type": "Person", name: "Nitin Monga", url: "https://nitinmonga.in/about-me/" },
    publisher: { "@type": "Person", name: "Nitin Monga", url: "https://nitinmonga.in/" },
    datePublished: post.publishedAt?.toISOString(),
    dateModified:  post.updatedAt?.toISOString(),
    ...(post.thumbnail ? { image: post.thumbnail } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://nitinmonga.in/blog/${post.slug}/` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",  item: "https://nitinmonga.in/" },
      { "@type": "ListItem", position: 2, name: "Blog",  item: "https://nitinmonga.in/blog/" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://nitinmonga.in/blog/${post.slug}/` },
    ],
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ReadingProgress />
      <SocialShareBar title={post.title} />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-28 pb-28">

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-10">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors group"
          >
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            >
              <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Articles
          </Link>
          <span style={{ color: "var(--color-border)" }}>/</span>
          <span
            className="font-body text-[11px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-full"
            style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
          >
            {post.category}
          </span>
        </div>

        {/* ── Two-column layout ──────────────────────────────────────────── */}
        <div
          className="lg:grid lg:items-start gap-10"
          style={{ gridTemplateColumns: "1fr 260px" }}
        >

          {/* ── Main article ─────────────────────────────────────────────── */}
          <article>

            {/* 1. Title */}
            <h1
              className="font-display font-bold text-[var(--color-ink)] leading-[1.06] mb-5"
              style={{ fontSize: "clamp(28px, 3.8vw, 52px)", letterSpacing: "-0.025em" }}
            >
              {post.title}
            </h1>

            {/* 2. Excerpt */}
            {post.excerpt && (
              <p
                className="font-body text-[var(--color-muted)] leading-[1.8] mb-7"
                style={{ fontSize: "clamp(15px, 1.1vw, 17px)", maxWidth: "640px" }}
              >
                {post.excerpt}
              </p>
            )}

            {/* 3. Meta strip */}
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-3 py-5 mb-8"
              style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}
            >
              {/* Author */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "var(--color-accent)" }}
                >
                  NM
                </div>
                <div>
                  <p className="font-body text-[13px] font-semibold text-[var(--color-ink)]">Nitin Monga</p>
                  <p className="font-body text-[11px] text-[var(--color-muted)]">Designer · Developer · 3D Artist</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-[var(--color-border)]" />

              {/* Category */}
              <span
                className="font-body text-[11px] font-bold uppercase tracking-[2px] px-3 py-1 rounded-full"
                style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
              >
                {post.category}
              </span>

              {/* Date */}
              {date && (
                <span className="font-body text-[12px] text-[var(--color-muted)]">{date}</span>
              )}

              {/* Read time */}
              {post.readTime && (
                <div className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1" style={{ color: "var(--color-muted)" }}/>
                    <path d="M6.5 4v2.8l1.8 1.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" style={{ color: "var(--color-muted)" }}/>
                  </svg>
                  <span className="font-body text-[12px] text-[var(--color-muted)]">{post.readTime} min read</span>
                </div>
              )}
            </div>

            {/* 4. Featured image */}
            {post.thumbnail && (
              <div
                className="w-full overflow-hidden rounded-[16px] mb-10"
                style={{ aspectRatio: "16/9" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 5. Body content */}
            <div className="prose-nm drop-cap" dangerouslySetInnerHTML={{ __html: html }} />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
                <p className="font-body text-[10px] uppercase tracking-[3px] text-[var(--color-muted)] mb-3">
                  Tagged
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-[12px] px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author footer card */}
            <div
              className="flex items-start gap-5 mt-14 p-6 rounded-[16px]"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-display text-base font-bold text-white"
                style={{ background: "var(--color-accent)" }}
              >
                NM
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-[var(--color-ink)] text-lg mb-1">Nitin Monga</p>
                <p className="font-body text-[13px] text-[var(--color-muted)] leading-relaxed mb-4 max-w-[420px]">
                  Graphic Designer, 3D Artist &amp; Full-Stack Developer based in Punjab, India.
                  10+ years building websites, CGI ads, and digital platforms.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/contact-us/" className="btn-primary">Work With Me</Link>
                  <Link href="/blog/" className="btn-secondary">← All Posts</Link>
                </div>
              </div>
            </div>

          </article>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-5" style={{ position: "sticky", top: "96px" }}>

            {/* Table of contents */}
            {headings.length > 0 && (
              <div
                className="p-5 rounded-[16px]"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* About the author */}
            <div
              className="p-5 rounded-[16px]"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <p className="section-label mb-4">// Author</p>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "var(--color-accent)" }}
                >
                  NM
                </div>
                <div>
                  <p className="font-body text-[13px] font-semibold text-[var(--color-ink)]">Nitin Monga</p>
                  <p className="font-body text-[11px] text-[var(--color-muted)]">Designer · Developer</p>
                </div>
              </div>
              <p className="font-body text-[12px] text-[var(--color-muted)] leading-relaxed mb-3">
                10+ years building websites, CGI campaigns &amp; digital platforms from Punjab, India.
              </p>
              <Link
                href="/about-me/"
                className="font-body text-[12px] font-semibold hover:underline"
                style={{ color: "var(--color-accent)" }}
              >
                More about me →
              </Link>
            </div>

            {/* CTA */}
            <div
              className="p-5 rounded-[16px]"
              style={{ background: "var(--color-accent)" }}
            >
              <p className="font-body text-[10px] font-bold uppercase tracking-[2px] mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                // Work with me
              </p>
              <p className="font-display font-bold text-white text-[18px] leading-snug mb-2">
                Have a project in mind?
              </p>
              <p className="font-body text-[12px] mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                I respond within 24 hours.
              </p>
              <Link
                href="/contact-us/"
                className="block w-full text-center font-body text-[13px] font-semibold py-2.5 rounded-[10px] transition-opacity hover:opacity-90"
                style={{ background: "#fff", color: "var(--color-accent)" }}
              >
                Start a Project
              </Link>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
