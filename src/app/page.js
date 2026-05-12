import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import EducationSection from '@/components/EducationSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import AwardsSection from '@/components/AwardsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import RevealObserver from '@/components/RevealObserver';

import { CONTACT } from '@/data/contact';
import { getAbout } from '@/lib/queries';

const ROLE = 'Full-stack developer';

function normalize(url) {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function urlHandle(url, platform) {
  if (!url) return '';
  try {
    const parts = new URL(normalize(url)).pathname.split('/').filter(Boolean);
    const slug = parts[parts.length - 1] || '';
    return platform === 'linkedin' ? `in/${slug}` : `@${slug}`;
  } catch {
    return url;
  }
}

function buildContactData(about) {
  const gh = normalize(about?.github_url);
  const li = normalize(about?.linkedin_url);
  const x  = normalize(about?.x_url);
  const links = [];
  if (gh) links.push({ label: 'GitHub',   handle: urlHandle(gh, 'github'),   icon: 'Github',   href: gh, el: 'air' });
  if (li) links.push({ label: 'LinkedIn', handle: urlHandle(li, 'linkedin'), icon: 'Linkedin', href: li, el: 'water' });
  if (x)  links.push({ label: 'X',        handle: urlHandle(x,  'x'),        icon: 'X',        href: x,  el: 'fire' });
  if (about?.email) links.push({ label: 'Email', handle: about.email, icon: 'Mail', href: `mailto:${about.email}`, el: 'earth' });
  return {
    blurb: about?.contact_blurb || CONTACT.blurb,
    email: about?.email || CONTACT.email,
    links: links.length ? links : CONTACT.links,
  };
}

export default async function Home() {
  const about = await getAbout();
  const NAME = about?.name || 'Your Name';
  const TAGLINE = about?.tagline || '';

  return (
    <>
      <Nav name={NAME} logo={about?.favicon_url} />
      <main>
        <div className="wrap">
          <Hero name={NAME} role={ROLE} tagline={TAGLINE} avatar={about?.avatar_url || '/portfolio-main-2.png'} />
        </div>
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <ProjectsSection />
        <AwardsSection />
        <ContactSection data={buildContactData(about)} />
        <div className="wrap">
          <Footer name={NAME} />
        </div>
      </main>
      <RevealObserver />
    </>
  );
}
