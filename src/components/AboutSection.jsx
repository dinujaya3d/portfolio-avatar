import { ElementBadge } from './icons/Glyphs';
import { getAbout } from '@/lib/queries';

export default async function AboutSection() {
  const data = await getAbout();
  return (
    <section className="bay" id="about">
      <div className="wrap">
        <div className="bay-element-tag reveal">
          <i style={{ background: 'var(--air)' }} />
          Element of Air · The breath behind the work
        </div>
        <div className="bay-head">
          <div className="reveal">
            <div className="bay-num">i.</div>
            <h2 className="bay-title">
              <ElementBadge el="air" size={44} />
              About<em>.</em>
            </h2>
          </div>
          <p className="bay-blurb reveal" style={{ '--rd': '120ms' }}>
            {data.tagline}
          </p>
        </div>

        <div className="about-grid">
          <div className="about-prose reveal" style={{ '--rd': '60ms' }}>
            {data.bio.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>
          <div className="about-tiles reveal" style={{ '--rd': '160ms' }}>
            {[
              { href: '/cv', label: 'CV', desc: 'Résumé & credentials', glyph: '↗' },
              { href: '/music', label: 'Music', desc: 'What I listen & create', glyph: '♫' },
              { href: '/books', label: 'Books', desc: 'What I read', glyph: '◎' },
              { href: '/thoughts', label: 'Thoughts', desc: 'Notes & ideas', glyph: '✦' },
            ].map(({ href, label, desc, glyph }) => (
              <a
                key={label}
                href={href}
                className="about-tile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="about-tile-glyph">{glyph}</span>
                <h4>{label}</h4>
                <p>{desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
