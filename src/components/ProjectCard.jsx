'use client';

import Link from 'next/link';
import useTilt from '../hooks/useTilt';

export default function ProjectCard({ p, idx, compact = false }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(5);

  const year = p.created_at ? new Date(p.created_at).getFullYear() : '';

  const cls = [
    'prj',
    compact ? '' : `prj-${idx + 1}`,
    p.featured ? 'featured' : '',
    'reveal',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link
      href={`/projects/${p.slug}`}
      ref={ref}
      className={cls}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ '--rd': `${idx * 70}ms` }}
    >
      <div className="prj-art" style={{ overflow: 'hidden' }}>
        {p.cover_image ? (
          <>
            {/* blurred fill — same image scaled+blurred to cover any aspect ratio */}
            <img
              src={p.cover_image}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(18px)',
                transform: 'scale(1.15)',
                opacity: 0.8,
              }}
            />
            {/* actual image, contained and centered on top */}
            <img
              src={p.cover_image}
              alt={p.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                zIndex: 1,
              }}
            />
            {/* dark panel — sits at z-index 1 (below prj-meta's z-index:2), image visible at top */}
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background: 'linear-gradient(to bottom, transparent 28%, rgba(8,6,4,0.82) 52%, rgba(8,6,4,0.96) 100%)',
              pointerEvents: 'none',
            }} />
          </>
        ) : (
          <span className="ph">drop screenshot</span>
        )}
      </div>
      <div className="prj-meta">
        <div className="prj-tag-row">
          <i />
          {year}
        </div>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
      </div>
    </Link>
  );
}
