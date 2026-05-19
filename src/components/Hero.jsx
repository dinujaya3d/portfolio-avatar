'use client';

import { useEffect } from 'react';
import { Arrow } from './icons/Social';

export default function Hero({
  name = 'Your Name',
  tagline = 'Crafting balance between code and craft.',
  avatar = '',
}) {
  // Sync no-motion class with OS preference (used by RevealObserver)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.body.classList.toggle('no-motion', mq.matches);
    const onChange = (e) => document.body.classList.toggle('no-motion', e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const [first, ...rest] = name.split(' ');
  const last = rest.join(' ');

  return (
    <header className="hero">
      <div>
        <div className="hero-eyebrow-row">
          <span className="dot" />
          <span className="eyebrow">Portfolio · est. 2026</span>
        </div>
        <h1 className="display">
          {first}
          <br />
          <em>{last || 'Name'}</em>
        </h1>
        <p className="hero-sub">{tagline}</p>
        <div className="hero-cta-row">
          <a className="btn btn-primary" href="#projects">
            See projects <Arrow width={16} height={16} />
          </a>
          <a className="btn btn-ghost" href="#contact">
            Get in touch
          </a>
        </div>
      </div>

      <div className="orb-stage" aria-hidden="true">
        {avatar && (
          <div className="avatar-stack">
            <div className="avatar-bg" />
            <img className="avatar-img" src={avatar} alt="" />
          </div>
        )}
      </div>
    </header>
  );
}
