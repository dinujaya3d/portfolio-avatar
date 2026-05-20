import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProjects, getProjectBySlug } from '@/lib/queries';
import ProjectContent from '@/components/ProjectContent';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Portfolio`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const year = project.created_at ? new Date(project.created_at).getFullYear() : '';

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 120 }}>

      {/* ── Full-width banner ─────────────────────────────── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(320px, 46vh, 540px)',
        overflow: 'hidden',
        background: 'var(--fire)',
      }}>
        {project.cover_image && (
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            priority
            unoptimized
            style={{ objectFit: 'cover' }}
          />
        )}

        {/* gradient — fades banner into page background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 35%, var(--paper) 100%)',
          pointerEvents: 'none',
        }} />

        {/* back button — floats over the banner */}
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0 }}>
          <div className="wrap">
            <Link
              href="/#projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                font: '500 13px/1 var(--sans)',
                color: '#fff',
                textDecoration: 'none',
                background: 'rgba(0,0,0,0.38)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '7px 14px',
                borderRadius: 20,
                letterSpacing: '0.01em',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              ← Projects
            </Link>
          </div>
        </div>
      </div>

      {/* ── Title / meta ──────────────────────────────────── */}
      <div style={{ paddingTop: 40, paddingBottom: 56 }}>
        <div className="wrap">

          <div className="bay-element-tag" style={{ marginBottom: 20 }}>
            <i style={{ background: 'var(--fire)' }} />
            {year}
          </div>

          <h1
            className="display"
            style={{ fontSize: 'clamp(42px, 7vw, 88px)', margin: '0 0 20px', lineHeight: 1.05 }}
          >
            {project.title}
          </h1>

          <p
            className="lede"
            style={{ marginBottom: 32, maxWidth: '60ch' }}
          >
            {project.description}
          </p>

          {project.tech_stack?.length > 0 && (
            <div className="t-tags" style={{ marginBottom: 28 }}>
              {project.tech_stack.map((t) => (
                <span className="t-tag" key={t}>{t}</span>
              ))}
            </div>
          )}

          {(project.live_url || project.github_url) && (
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    font: '500 14px/1 var(--sans)',
                    color: 'var(--paper)',
                    background: 'var(--fire)',
                    padding: '9px 18px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                  }}
                >
                  Live site ↗
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    font: '500 14px/1 var(--sans)',
                    color: 'var(--ink)',
                    border: '.5px solid var(--rule)',
                    padding: '9px 18px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                  }}
                >
                  GitHub ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Markdown content ──────────────────────────────── */}
      {project.content && (
        <div className="wrap">
          <ProjectContent content={project.content} />
        </div>
      )}

    </main>
  );
}
