import Link from 'next/link';
import AwardCard from './AwardCard';
import { getFeaturedAwards, getAwards } from '@/lib/queries';

export default async function AwardsSection() {
  const [featured, all] = await Promise.all([getFeaturedAwards(), getAwards()]);
  if (all.length === 0) return null;

  const remaining = all.length - featured.length;

  return (
    <section className="bay sky-bay" id="awards">
      <div className="wrap">
        <div className="bay-element-tag reveal">
          <i style={{ background: 'oklch(72% 0.12 75)' }} />
          Recognition and milestones
        </div>
        <div className="bay-head">
          <div className="reveal">
            <div className="bay-num">v.</div>
            <h2 className="bay-title">
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: 'color-mix(in oklch, oklch(72% 0.12 75) 18%, var(--paper))',
                fontSize: 20, marginRight: 8,
              }}>★</span>
              Awards<em>.</em>
            </h2>
          </div>
          <p className="bay-blurb reveal" style={{ '--rd': '120ms' }}>
            Recognitions, honours, and milestones gathered along the way.
          </p>
        </div>

        <div className="prj-grid">
          {featured.map((a, i) => (
            <AwardCard key={a.slug} award={a} idx={i} />
          ))}
          <Link
            href="/awards"
            className={`prj prj-${featured.length + 1} prj-viewall reveal`}
            style={{ '--rd': `${featured.length * 70}ms` }}
          >
            <div className="prj-viewall-inner">
              <span className="prj-viewall-label">All awards</span>
              <span className="prj-viewall-count">
                {remaining > 0 ? `+${remaining} more` : `${all.length} total`}
              </span>
              <svg className="prj-viewall-arrow" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 16h20M18 8l8 8-8 8" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
