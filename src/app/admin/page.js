'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import ProjectsTab from './_tabs/ProjectsTab';
import AboutTab from './_tabs/AboutTab';
import ExperienceTab from './_tabs/ExperienceTab';
import EducationTab from './_tabs/EducationTab';
import SkillsTab from './_tabs/SkillsTab';
import LinksTab from './_tabs/LinksTab';
import PagesTab from './_tabs/PagesTab';
import AwardsTab from './_tabs/AwardsTab';

const TABS = ['Projects', 'About', 'Experience', 'Education', 'Skills', 'Links', 'Pages', 'Awards'];

export default function AdminPage() {
  const [tab, setTab] = useState('Projects');
  const router = useRouter();
  const sb = useMemo(() => getSupabaseBrowser(), []);

  async function handleLogout() {
    await sb.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', borderBottom: '1px solid #1e1e1e' }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', color: '#e8e8e8' }}>
          Portfolio · Admin
        </span>
        <button
          onClick={handleLogout}
          style={{ fontSize: 12, color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          Sign out
        </button>
      </header>

      <nav style={{ display: 'flex', gap: 0, padding: '0 32px', borderBottom: '1px solid #1e1e1e' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontSize: 13,
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '2px solid #e8e8e8' : '2px solid transparent',
              color: tab === t ? '#e8e8e8' : '#555',
              cursor: 'pointer',
              marginBottom: -1,
              transition: 'color 0.15s',
            }}
          >
            {t}
          </button>
        ))}
      </nav>

      <main style={{ padding: '32px' }}>
        {tab === 'Projects'   && <ProjectsTab />}
        {tab === 'About'      && <AboutTab />}
        {tab === 'Experience' && <ExperienceTab />}
        {tab === 'Education'  && <EducationTab />}
        {tab === 'Skills'     && <SkillsTab />}
        {tab === 'Links'      && <LinksTab />}
        {tab === 'Pages'      && <PagesTab />}
        {tab === 'Awards'     && <AwardsTab />}
      </main>
    </div>
  );
}
