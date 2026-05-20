'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import VideoEmbed from './VideoEmbed';

const isVideoUrl = (url) =>
  url && (/youtube\.com|youtu\.be/.test(url) || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url));

const components = {
  // Unwrap bare video links — filter out whitespace text nodes before checking
  p({ node, children }) {
    const real = (node.children || []).filter(
      c => !(c.type === 'text' && c.value.trim() === '')
    );
    if (real.length === 1 && real[0].type === 'element' && real[0].tagName === 'a') {
      const href = real[0].properties?.href;
      if (isVideoUrl(href)) return <VideoEmbed url={href} />;
    }
    return <p style={s.p}>{children}</p>;
  },

  img({ src, alt }) {
    if (!src) return null;
    return (
      <span style={{ display: 'block', position: 'relative', width: '100%', margin: '2rem 0' }}>
        <Image
          src={src}
          alt={alt || ''}
          width={1200}
          height={675}
          unoptimized
          style={{ width: '100%', height: 'auto', borderRadius: 14, display: 'block' }}
        />
        {alt && <span style={s.caption}>{alt}</span>}
      </span>
    );
  },

  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={s.a}>
        {children}
      </a>
    );
  },

  h1({ children }) { return <h1 style={s.h1}>{children}</h1>; },
  h2({ children }) { return <h2 style={s.h2}>{children}</h2>; },
  h3({ children }) { return <h3 style={s.h3}>{children}</h3>; },

  ul({ children }) { return <ul style={s.list}>{children}</ul>; },
  ol({ children }) { return <ol style={{ ...s.list, listStyleType: 'decimal' }}>{children}</ol>; },
  li({ children }) { return <li style={s.li}>{children}</li>; },

  blockquote({ children }) {
    return (
      <blockquote style={s.blockquote}>{children}</blockquote>
    );
  },

  code({ node, children }) {
    const isInline = node.position?.start.line === node.position?.end.line;
    if (isInline) return <code style={s.inlineCode}>{children}</code>;
    return (
      <pre style={s.pre}>
        <code style={{ fontFamily: 'var(--mono, monospace)', fontSize: 13 }}>{children}</code>
      </pre>
    );
  },

  hr() {
    return <hr style={s.hr} />;
  },

  strong({ children }) { return <strong style={{ fontWeight: 600 }}>{children}</strong>; },
};

export default function ProjectContent({ content }) {
  return (
    <div style={s.root}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

const s = {
  root: {
    maxWidth: '72ch',
    margin: '0 auto',
    color: 'var(--ink)',
    lineHeight: 1.75,
  },
  p: {
    margin: '0 0 1.4rem',
    font: '400 17px/1.75 var(--sans, system-ui)',
    color: 'var(--ink)',
  },
  a: {
    color: 'var(--fire)',
    textDecoration: 'underline',
    textUnderlineOffset: 3,
  },
  h1: {
    font: '600 clamp(28px,4vw,40px)/1.2 var(--serif, Georgia)',
    margin: '3rem 0 1rem',
    color: 'var(--ink)',
  },
  h2: {
    font: '600 clamp(22px,3vw,30px)/1.3 var(--serif, Georgia)',
    margin: '2.5rem 0 0.75rem',
    color: 'var(--ink)',
  },
  h3: {
    font: '600 18px/1.4 var(--sans, system-ui)',
    margin: '2rem 0 0.5rem',
    color: 'var(--ink)',
  },
  list: {
    margin: '0 0 1.4rem',
    paddingLeft: '1.5rem',
    listStyleType: 'disc',
  },
  li: {
    font: '400 17px/1.75 var(--sans, system-ui)',
    marginBottom: '0.35rem',
    color: 'var(--ink)',
  },
  blockquote: {
    borderLeft: '3px solid var(--fire)',
    margin: '1.5rem 0',
    padding: '0.5rem 0 0.5rem 1.25rem',
    color: 'var(--ink-mute)',
    fontStyle: 'italic',
  },
  inlineCode: {
    fontFamily: 'var(--mono, monospace)',
    fontSize: '0.875em',
    background: 'var(--rule, rgba(0,0,0,0.06))',
    padding: '0.15em 0.4em',
    borderRadius: 4,
  },
  pre: {
    background: 'var(--rule, rgba(0,0,0,0.06))',
    borderRadius: 10,
    padding: '1.25rem',
    overflowX: 'auto',
    margin: '1.5rem 0',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid var(--rule)',
    margin: '3rem 0',
  },
  caption: {
    display: 'block',
    textAlign: 'center',
    fontSize: 12,
    color: 'var(--ink-mute)',
    marginTop: 8,
    fontStyle: 'italic',
  },
};
