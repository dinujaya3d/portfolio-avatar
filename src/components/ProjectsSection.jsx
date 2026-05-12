import Link from 'next/link';
import { ElementBadge } from './icons/Glyphs';
import ProjectCard from './ProjectCard';
import { getFeaturedProjects, getProjects } from '@/lib/queries';

export default async function ProjectsSection() {
  const [featured, all] = await Promise.all([getFeaturedProjects(), getProjects()]);
  const remaining = all.length - featured.length;
  return (
    <section className="bay fire-bay" id="projects">
      <div className="wrap">
        <div className="bay-element-tag reveal">
          <i style={{ background: 'var(--fire)' }} />
          Element of Fire · Things made with intent and heat
        </div>
        <div className="bay-head">
          <div className="reveal">
            <div className="bay-num">iv.</div>
            <h2 className="bay-title">
              <ElementBadge el="fire" size={44} />
              Projects<em>.</em>
            </h2>
          </div>
          <p className="bay-blurb reveal" style={{ '--rd': '120ms' }}>
            Selected work — products, tools, and small experiments. Drop a real
            screenshot in the artwork slots whenever you&apos;re ready.
          </p>
        </div>

        <div className="prj-grid">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} p={p} idx={i} />
          ))}

          {/* View-all tile — sits in the grid as the next slot */}
          <Link
            href="/projects"
            className={`prj prj-${featured.length + 1} prj-viewall reveal`}
            style={{ '--rd': `${featured.length * 70}ms` }}
          >
            <div className="prj-viewall-inner">
              <span className="prj-viewall-label">All projects</span>
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
