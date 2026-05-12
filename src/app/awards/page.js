import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AwardCard from '@/components/AwardCard';
import RevealObserver from '@/components/RevealObserver';
import { getAwards, getAbout } from '@/lib/queries';

export const metadata = {
  title: 'Awards & Achievements',
  description: 'Recognitions, honours, and milestones.',
};

export default async function AwardsPage() {
  const [awards, about] = await Promise.all([getAwards(), getAbout()]);
  const NAME = about?.name || 'Your Name';

  return (
    <>
      <Nav name={NAME} logo={about?.favicon_url} />
      <main style={{ minHeight: '100vh', paddingBottom: 120 }}>
        <div className="wrap" style={{ paddingTop: 120 }}>

          <Link
            href="/#awards"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              font: '500 13px/1 var(--sans)',
              color: 'var(--ink-3)',
              textDecoration: 'none',
              marginBottom: 48,
              letterSpacing: '0.01em',
            }}
          >
            ← Back
          </Link>

          <div className="bay-element-tag" style={{ marginBottom: 20 }}>
            <i style={{ background: 'oklch(72% 0.12 75)' }} />
            Recognition and milestones
          </div>

          <div style={{ marginBottom: 56 }}>
            <div className="bay-num">All awards.</div>
            <h1 className="bay-title" style={{ fontSize: 'clamp(42px, 6vw, 80px)', margin: '8px 0 0' }}>
              Awards<em>.</em>
            </h1>
          </div>

          <div className="prj-all-grid">
            {awards.map((a, i) => (
              <AwardCard key={a.slug} award={a} idx={i} compact />
            ))}
          </div>

          {awards.length === 0 && (
            <p style={{ color: 'var(--ink-mute)', font: '400 15px/1.6 var(--sans)', marginTop: 40 }}>
              No awards yet.
            </p>
          )}

        </div>
        <div className="wrap">
          <Footer name={NAME} />
        </div>
      </main>
      <RevealObserver />
    </>
  );
}
