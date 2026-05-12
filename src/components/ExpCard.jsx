'use client';

import useTilt from '../hooks/useTilt';

function fmt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function renderDescription(text) {
  if (!text) return null;
  const blocks = [];
  let currentBullets = [];

  const flush = () => {
    if (currentBullets.length) {
      blocks.push({ type: 'bullets', items: currentBullets });
      currentBullets = [];
    }
  };

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentBullets.push(trimmed.slice(2));
    } else if (trimmed === '') {
      flush();
    } else {
      flush();
      blocks.push({ type: 'para', text: trimmed });
    }
  }
  flush();

  return blocks.map((b, i) =>
    b.type === 'bullets'
      ? <ul key={i} className="exp-bullets">{b.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
      : <p key={i}>{b.text}</p>
  );
}

export default function ExpCard({ row, idx }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(4);
  const when = `${fmt(row.start_date)} – ${row.current ? 'Present' : fmt(row.end_date)}`;

  return (
    <div
      ref={ref}
      className="exp-card reveal"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ '--rd': `${idx * 90}ms` }}
    >
      <div className="exp-row">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {row.logo_url && (
            <img src={row.logo_url} alt={row.company} className="exp-logo" />
          )}
          <div>
            <h3>{row.role}</h3>
            <div className="exp-co">{row.company}</div>
          </div>
        </div>
        <div className="exp-when">{when}</div>
      </div>
      {renderDescription(row.description)}
    </div>
  );
}
