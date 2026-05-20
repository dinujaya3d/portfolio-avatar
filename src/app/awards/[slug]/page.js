import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAwards, getAwardBySlug } from '@/lib/queries';
import ProjectContent from '@/components/ProjectContent';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const awards = await getAwards();
  return awards.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const award = await getAwardBySlug(slug);
  if (!award) return {};
  return {
    title: `${award.title} — Portfolio`,
    description: award.description,
  };
}

export default async function AwardPage({ params }) {
  const { slug } = await params;
  const award = await getAwardBySlug(slug);
  if (!award) notFound();

  const dateStr = award.date
    ? new Date(award.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;
  const tagLine = [award.issuer, dateStr].filter(Boolean).join(' · ');

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 120 }}>

      {/* Banner */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(300px, 42vh, 480px)',
        overflow: 'hidden',
        background: 'color-mix(in oklch, oklch(72% 0.12 75) 22%, var(--paper-2))',
      }}>
        {award.cover_image && (
          <Image src={award.cover_image} alt={award.title} fill priority unoptimized style={{ objectFit: 'cover' }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 35%, var(--paper) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0 }}>
          <div className="wrap">
            <Link
              href="/awards"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
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
              ← Awards
            </Link>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ paddingTop: 40, paddingBottom: 48 }}>
        <div className="wrap">
          {tagLine && (
            <div className="bay-element-tag" style={{ marginBottom: 16 }}>
              <i style={{ background: 'oklch(72% 0.12 75)' }} />
              {tagLine}
            </div>
          )}
          <h1
            className="display"
            style={{ fontSize: 'clamp(38px, 6vw, 76px)', margin: 0, lineHeight: 1.05 }}
          >
            {award.title}
          </h1>
          {award.description && (
            <p className="lede" style={{ marginTop: 20, maxWidth: '60ch' }}>
              {award.description}
            </p>
          )}
        </div>
      </div>

      {award.content && (
        <div className="wrap">
          <ProjectContent content={award.content} />
        </div>
      )}

    </main>
  );
}
