export const revalidate = 3600;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ReadingProgress } from "@/components/pages/blog/ReadingProgress";
import { TableOfContents } from "@/components/pages/blog/TableOfContents";
import { SocialShareBar } from "@/components/pages/blog/SocialShareBar";

interface Props { params: { slug: string } }

function injectHeadingIds(html: string): string {
  return html.replace(/<h([23])>([\s\S]+?)<\/h\1>/g, (_, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, "");
    const id = text.toLowerCase().replace(/[^\w\s]/g, "").trim().replace(/\s+/g, "-");
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
}

function extractHeadings(html: string): Array<{ id: string; text: string; level: number }> {
  const out: Array<{ id: string; text: string; level: number }> = [];
  const re = /<h([23]) id="([^"]+)">([\s\S]+?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    out.push({ level: +m[1], id: m[2], text: m[3].replace(/<[^>]+>/g, "") });
  }
  return out;
}

async function getProject(slug: string) {
  try {
    return await prisma.project.findUnique({ where: { slug, published: true } });
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      ...(project.thumbnail ? { images: [{ url: project.thumbnail }] } : {}),
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const tags: string[]   = project.tags      ? JSON.parse(project.tags)      : [];
  const tech: string[]   = project.techStack ? JSON.parse(project.techStack) : [];
  const images: string[] = project.images    ? JSON.parse(project.images)    : [];

  const bodyHtml   = project.longDesc ? injectHeadingIds(project.longDesc) : "";
  const headings   = extractHeadings(bodyHtml);

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <ReadingProgress />
      <SocialShareBar title={project.title} />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-28 pb-28">

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-10">
          <Link
            href="/work/"
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors group"
          >
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            >
              <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Projects
          </Link>
          <span style={{ color: "var(--color-border)" }}>/</span>
          <span
            className="font-body text-[11px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-full"
            style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
          >
            {project.category}
          </span>
          {project.featured && (
            <span
              className="font-body text-[11px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-full border"
              style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
            >
              Featured
            </span>
          )}
        </div>

        {/* ── Two-column layout ─────────────────────────────────────────── */}
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
              {project.title}
            </h1>

            {/* 2. Short description */}
            {project.description && (
              <p
                className="font-body text-[var(--color-muted)] leading-[1.8] mb-7"
                style={{ fontSize: "clamp(15px, 1.1vw, 17px)", maxWidth: "640px" }}
              >
                {project.description}
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

              <div className="hidden sm:block w-px h-8 bg-[var(--color-border)]" />

              {/* Category */}
              <span
                className="font-body text-[11px] font-bold uppercase tracking-[2px] px-3 py-1 rounded-full"
                style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
              >
                {project.category}
              </span>

              {/* Tech */}
              {tech.length > 0 && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-[var(--color-border)]" />
                  <div className="flex flex-wrap gap-1.5">
                    {tech.map((t) => (
                      <span
                        key={t}
                        className="font-body text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Live URL */}
              {project.liveUrl && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-[var(--color-border)]" />
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-body text-[12px] font-semibold hover:underline"
                    style={{ color: "var(--color-accent)" }}
                  >
                    Visit Site
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 9.5l8-8M9.5 9.5V1.5h-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </>
              )}
            </div>

            {/* 4. Featured image */}
            {project.thumbnail && (
              <div
                className="w-full overflow-hidden rounded-[16px] mb-10"
                style={{ aspectRatio: "16/9" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 5. Case study body */}
            {bodyHtml && (
              <div className="prose-nm drop-cap" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            )}

            {/* 6. Gallery */}
            {images.length > 0 && (
              <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
                <p className="section-label mb-6">// Gallery</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {images.map((src, i) => (
                    <div key={i} className="rounded-[12px] overflow-hidden border border-[var(--color-border)] aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${project.title} — image ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Tags */}
            {tags.length > 0 && (
              <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
                <p className="font-body text-[10px] uppercase tracking-[3px] text-[var(--color-muted)] mb-3">Tagged</p>
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

            {/* 8. CTA footer card */}
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
                <p className="font-display font-bold text-[var(--color-ink)] text-lg mb-1">Have a similar project?</p>
                <p className="font-body text-[13px] text-[var(--color-muted)] leading-relaxed mb-4 max-w-[420px]">
                  Graphic Designer, 3D Artist &amp; Full-Stack Developer based in Punjab, India. Let&apos;s build something great together.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/contact-us/" className="btn-primary">Start a Project</Link>
                  <Link href="/work/" className="btn-secondary">← All Projects</Link>
                </div>
              </div>
            </div>

          </article>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-5 mt-10 lg:mt-0" style={{ position: "sticky", top: "96px" }}>

            {/* Table of contents */}
            {headings.length > 0 && (
              <div
                className="p-5 rounded-[16px]"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* Project Info */}
            <div
              className="p-5 rounded-[16px]"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <p className="section-label mb-4">// Project Info</p>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[2px] text-[var(--color-muted)] mb-1">Category</p>
                  <span
                    className="font-body text-[12px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
                  >
                    {project.category}
                  </span>
                </div>

                {tech.length > 0 && (
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[2px] text-[var(--color-muted)] mb-1.5">Tech Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tech.map((t) => (
                        <span
                          key={t}
                          className="font-body text-[11px] px-2 py-0.5 rounded-full"
                          style={{ background: "var(--color-accent-light)", color: "var(--color-accent-dark)", border: "1px solid var(--color-border)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.liveUrl && (
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[2px] text-[var(--color-muted)] mb-1">Live URL</p>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[12px] font-semibold inline-flex items-center gap-1 hover:underline"
                      style={{ color: "var(--color-accent)" }}
                    >
                      Visit Site
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 9L9 1M9 9V1H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                )}
              </div>
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
