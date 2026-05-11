import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { slug: string };
}

async function getProject(slug: string) {
  try {
    return await prisma.project.findUnique({ where: { slug, published: true } });
  } catch {
    return null;
  }
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

  const tags: string[]     = project.tags      ? JSON.parse(project.tags)      : [];
  const tech: string[]     = project.techStack ? JSON.parse(project.techStack) : [];
  const images: string[]   = project.images    ? JSON.parse(project.images)    : [];

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">

      {/* Hero */}
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8 pt-16">

        {/* Back */}
        <Link
          href="/work/"
          className="inline-flex items-center gap-2 font-body text-[13px] text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All Projects
        </Link>

        {/* Category + year */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span
            className="font-body text-[11px] font-semibold uppercase tracking-[2px] px-3 py-1 rounded-full text-white"
            style={{ background: "var(--color-accent)" }}
          >
            {project.category}
          </span>
          {project.featured && (
            <span className="font-body text-[11px] font-semibold uppercase tracking-[2px] px-3 py-1 rounded-full border border-[var(--color-accent)] text-[var(--color-accent)]">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="font-display font-bold text-[var(--color-ink)] leading-tight mb-6"
          style={{ fontSize: "clamp(28px, 4vw, 60px)" }}
        >
          {project.title}
        </h1>

        {/* Short description */}
        <p className="font-body text-[var(--color-muted)] leading-[1.8] max-w-[700px] mb-8"
          style={{ fontSize: "clamp(15px, 1.1vw, 18px)" }}>
          {project.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-6 mb-10 pb-8 border-b border-[var(--color-border)]">
          {tech.length > 0 && (
            <div>
              <p className="font-body text-[11px] uppercase tracking-widest text-[var(--color-muted)] mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {tech.map((t) => (
                  <span key={t} className="font-body text-[12px] px-2.5 py-0.5 rounded-full"
                    style={{ background: "var(--color-accent-light)", color: "var(--color-accent-dark)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <p className="font-body text-[11px] uppercase tracking-widest text-[var(--color-muted)] mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="font-body text-[12px] px-2.5 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {project.liveUrl && (
            <div>
              <p className="font-body text-[11px] uppercase tracking-widest text-[var(--color-muted)] mb-2">Live URL</p>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[13px] text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
              >
                Visit Site
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main thumbnail */}
      {project.thumbnail && (
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8 mb-16">
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[var(--color-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Long description / case study body */}
      {project.longDesc && (
        <div className="max-w-[860px] mx-auto px-6 lg:px-8 mb-16">
          <p className="section-label mb-6">{"// Overview"}</p>
          <div className="font-body text-[var(--color-muted)] leading-[1.9] whitespace-pre-wrap"
            style={{ fontSize: "clamp(15px, 1.05vw, 17px)" }}>
            {project.longDesc}
          </div>
        </div>
      )}

      {/* Additional images */}
      {images.length > 0 && (
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8 mb-16">
          <p className="section-label mb-6">{"// Gallery"}</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {images.map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-[var(--color-border)] aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${project.title} — image ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8 pb-24">
        <div className="card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-[var(--color-ink)] text-xl mb-1">Have a similar project?</h2>
            <p className="font-body text-[var(--color-muted)] text-[14px]">Let&apos;s talk about what you need and how I can help.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/work/" className="btn-secondary">← All Projects</Link>
            <Link href="/contact-us/" className="btn-primary">Start a Project</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
