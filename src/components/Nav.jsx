'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Arrow } from './icons/Social';

function SunIcon() {
  return (
    <svg
      className="t-sun"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="t-moon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export default function Nav({ name = 'Your Name', logo }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="nav-logo">
          {logo
            ? <img src={logo} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            : <span className="nav-mark" />
          }
          {name}
        </Link>

        <div className="nav-links">
          <a href="#about" data-el="air">About</a>
          <a href="#education" data-el="water">Education</a>
          <a href="#experience" data-el="earth">Experience</a>
          <a href="#projects" data-el="fire">Projects</a>
        </div>

        <div className="nav-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          >
            <SunIcon />
            <MoonIcon />
          </button>
          <a href="#contact" className="nav-cta">
            Contact <Arrow width={12} height={12} style={{ marginLeft: 4 }} />
          </a>
        </div>
      </div>
    </nav>
  );
}
