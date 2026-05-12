import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContentItem } from '@/lib/queries';
import ProjectContent from './ProjectContent';

const ACCENT = {
  music:    'var(--water)',
  books:    'var(--air)',
  thoughts: 'var(--fire)',
};

export default async function ContentDetailPage({ id, pageSlug }) {
  const item = await getContentItem(id).catch(() => null);
  if (!item) notFound();

  const accent = ACCENT[pageSlug] || 'var(--ink)';
  const pageLabel = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 120 }}>

      {/* Banner */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(260px, 38vh, 440px)',
        overflow: 'hidden',
        background: `color-mix(in oklch, ${accent} 20%, var(--paper-2))`,
      }}>
        {item.cover_image && (
          <Image src={item.cover_image} alt={item.title} fill priority style={{ objectFit: 'cover' }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, transparent 35%, var(--paper) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Back button */}
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0 }}>
          <div className="wrap">
            <Link
              href={`/${pageSlug}`}
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
              ← {pageLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ paddingTop: 40, paddingBottom: 48 }}>
        <div className="wrap">
          {item.subtitle && (
            <div className="bay-element-tag" style={{ marginBottom: 14, color: accent }}>
              <i style={{ background: accent, width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }} />
              &nbsp;{item.subtitle}
            </div>
          )}
          <h1
            className="display"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)', margin: '0 0 0', lineHeight: 1.05 }}
          >
            {item.title}
          </h1>
        </div>
      </div>

      {/* Markdown content */}
      {item.content && (
        <div className="wrap">
          <ProjectContent content={item.content} />
        </div>
      )}
    </main>
  );
}
