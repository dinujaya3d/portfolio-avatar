import { ElementBadge } from './icons/Glyphs';
import { getEducation } from '@/lib/queries';

export default async function EducationSection() {
  const data = await getEducation();
  return (
    <section className="bay water-bay" id="education">
      <div className="wrap">
        <div className="bay-element-tag reveal">
          <i style={{ background: 'var(--water)' }} />
          Element of Water · Learning that flows and adapts
        </div>
        <div className="bay-head">
          <div className="reveal">
            <div className="bay-num">ii.</div>
            <h2 className="bay-title">
              <ElementBadge el="water" size={44} />
              Education<em>.</em>
            </h2>
          </div>
          <p className="bay-blurb reveal" style={{ '--rd': '120ms' }}>
            A path shaped less by a destination and more by the bend of
            curiosity. Here are the currents that shaped how I think.
          </p>
        </div>

        <div className="timeline">
          {data.map((row, i) => (
            <div
              className="t-row reveal"
              key={i}
              style={{ '--rd': `${i * 100}ms` }}
            >
              <div className="t-when">{row.start_year} – {row.end_year || 'Present'}</div>
              <div className="t-card">
                <div className="t-card-head">
                  {row.logo_url && (
                    <img src={row.logo_url} alt={row.institution} className="t-logo" />
                  )}
                  <div>
                    <h3>{row.degree}</h3>
                    <div className="t-where">{row.institution}</div>
                  </div>
                </div>
                {row.description && <p>{row.description}</p>}
                {row.field && (
                  <div className="t-tags">
                    <span className="t-tag">{row.field}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
