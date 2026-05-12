'use client';

import Link from 'next/link';
import useTilt from '../hooks/useTilt';

export default function AwardCard({ award, idx, compact = false }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(5);

  const cls = [
    'prj',
    compact ? '' : `prj-${idx + 1}`,
    award.featured ? 'featured' : '',
    'reveal',
  ].filter(Boolean).join(' ');

  return (
    <Link
      href={`/awards/${award.slug}`}
      ref={ref}
      className={cls}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ '--rd': `${idx * 70}ms` }}
    >
      <div className="prj-art" style={{ overflow: 'hidden' }}>
        {award.cover_image ? (
          <>
            <img
              src={award.cover_image}
              alt=""
              aria-hidden
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                filter: 'blur(18px)',
                transform: 'scale(1.15)',
                opacity: 0.8,
              }}
            />
            <img
              src={award.cover_image}
              alt={award.title}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'contain',
                zIndex: 1,
              }}
            />
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to bottom, transparent 28%, rgba(8,6,4,0.82) 52%, rgba(8,6,4,0.96) 100%)',
              pointerEvents: 'none',
            }} />
          </>
        ) : (
          <span className="ph">★</span>
        )}
      </div>
      <div className="prj-meta">
        <div className="prj-tag-row">
          <i />
          {award.issuer || ''}
        </div>
        <h3>{award.title}</h3>
        {award.description && <p>{award.description}</p>}
      </div>
    </Link>
  );
}
