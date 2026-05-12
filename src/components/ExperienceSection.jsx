import { ElementBadge } from './icons/Glyphs';
import ExpCard from './ExpCard';
import { getExperience } from '@/lib/queries';

export default async function ExperienceSection() {
  const data = await getExperience();
  return (
    <section className="bay earth-bay" id="experience">
      <div className="wrap">
        <div className="bay-element-tag reveal">
          <i style={{ background: 'var(--earth)' }} />
          Element of Earth · Steady ground, real things shipped
        </div>
        <div className="bay-head">
          <div className="reveal">
            <div className="bay-num">iii.</div>
            <h2 className="bay-title">
              <ElementBadge el="earth" size={44} />
              Experience<em>.</em>
            </h2>
          </div>
          <p className="bay-blurb reveal" style={{ '--rd': '120ms' }}>
            Where the practice took root. A handful of teams, products and
            problems I helped move forward.
          </p>
        </div>

        <div className="exp-grid">
          {data.map((row, i) => (
            <ExpCard key={i} row={row} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
