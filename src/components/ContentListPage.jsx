import Image from 'next/image';
import Link from 'next/link';
import Nav from './Nav';
import { getAbout, getContentPage, getContentItems } from '@/lib/queries';

const ACCENT = {
  music:    { color: 'var(--water)',  soft: 'var(--water-soft)' },
  books:    { color: 'var(--air)',    soft: 'var(--air-soft)'   },
  thoughts: { color: 'var(--fire)',   soft: 'var(--fire-soft)'  },
};

function strip(md = '') {
  return md.replace(/[#*`_~\[\]()>!]/g, '').replace(/\n+/g, ' ').trim();
}

export default async function ContentListPage({ pageSlug }) {
  const [about, page, items] = await Promise.all([
    getAbout(),
    getContentPage(pageSlug),
    getContentItems(pageSlug),
  ]);

  const ac = ACCENT[pageSlug] || ACCENT.thoughts;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <Nav name={about.name} logo={about.favicon_url} />

      {/* Header */}
      <div style={{ paddingTop: 110, paddingBottom: 64, borderBottom: '.5px solid var(--rule)' }}>
        <div className="wrap">
          <div className="bay-element-tag" style={{ marginBottom: 18 }}>
            <i style={{ background: ac.color, width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }} />
            &nbsp;{page.title}
          </div>
          <h1
            className="bay-title"
            style={{ fontSize: 'clamp(48px, 7vw, 80px)', marginBottom: page.description ? 20 : 0 }}
          >
            {page.title}<em>.</em>
          </h1>
          {page.description && (
            <p style={{ font: '400 19px/1.6 var(--display)', color: 'var(--ink-2)', maxWidth: '56ch', margin: 0 }}>
              {page.description}
            </p>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="wrap" style={{ paddingTop: 56 }}>
        {items.length === 0 ? (
          <p style={{ font: '400 16px/1.6 var(--sans)', color: 'var(--ink-mute)' }}>
            Nothing here yet — check back soon.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {items.map(item => (
              <Link
                key={item.id}
                href={`/${pageSlug}/${item.id}`}
                style={{ textDecoration: 'none', color: 'var(--ink)' }}
              >
                <article style={{
                  border: '.5px solid var(--rule)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: 'var(--paper)',
                  transition: 'transform .22s ease, box-shadow .22s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  {item.cover_image && (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: ac.soft }}>
                      <Image src={item.cover_image} alt={item.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  {!item.cover_image && (
                    <div style={{
                      height: 8,
                      background: `linear-gradient(90deg, ${ac.color}, color-mix(in oklch, ${ac.color} 40%, transparent))`,
                    }} />
                  )}
                  <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ margin: '0 0 6px', font: '500 20px/1.2 var(--display)' }}>{item.title}</h2>
                    {item.subtitle && (
                      <p style={{ margin: '0 0 10px', font: '500 13px/1 var(--sans)', color: ac.color }}>{item.subtitle}</p>
                    )}
                    {item.content && (
                      <p style={{ margin: '0 0 0 auto', font: '400 14px/1.55 var(--sans)', color: 'var(--ink-3)', paddingTop: 10 }}>
                        {strip(item.content).slice(0, 120)}{strip(item.content).length > 120 ? '…' : ''}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
