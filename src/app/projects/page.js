import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import RevealObserver from '@/components/RevealObserver';
import { getProjects, getAbout } from '@/lib/queries';

export const metadata = {
  title: 'All Projects',
  description: 'A full list of projects — products, tools, and experiments.',
};

export default async function ProjectsPage() {
  const [projects, about] = await Promise.all([getProjects(), getAbout()]);
  const NAME = about?.name || 'Your Name';

  return (
    <>
      <Nav name={NAME} logo={about?.favicon_url} />
      <main style={{ minHeight: '100vh', paddingBottom: 120 }}>
        <div className="wrap" style={{ paddingTop: 120 }}>

          <Link
            href="/#projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
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
            <i style={{ background: 'var(--fire)' }} />
            Element of Fire · Things made with intent and heat
          </div>

          <div style={{ marginBottom: 56 }}>
            <div className="bay-num">All projects.</div>
            <h1
              className="bay-title"
              style={{ fontSize: 'clamp(42px, 6vw, 80px)', margin: '8px 0 0' }}
            >
              Projects<em>.</em>
            </h1>
          </div>

          <div className="prj-all-grid">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} p={p} idx={i} compact />
            ))}
          </div>

          {projects.length === 0 && (
            <p style={{ color: 'var(--ink-mute)', font: '400 15px/1.6 var(--sans)', marginTop: 40 }}>
              No projects yet.
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
