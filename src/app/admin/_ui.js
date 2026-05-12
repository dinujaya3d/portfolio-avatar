export function Field({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <label style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export const inp = {
  background: '#161616',
  border: '1px solid #2a2a2a',
  borderRadius: 6,
  padding: '8px 12px',
  color: '#e8e8e8',
  fontSize: 13,
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
};

export const btnPrimary = {
  background: '#fff',
  color: '#000',
  border: 'none',
  borderRadius: 6,
  padding: '8px 18px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

export const btnGhost = {
  background: 'none',
  color: '#888',
  border: '1px solid #2a2a2a',
  borderRadius: 6,
  padding: '8px 18px',
  fontSize: 13,
  cursor: 'pointer',
};

export const btnSm = {
  background: 'none',
  color: '#aaa',
  border: '1px solid #2a2a2a',
  borderRadius: 4,
  padding: '4px 10px',
  fontSize: 12,
  cursor: 'pointer',
};

export const btnDanger = {
  background: 'none',
  color: '#ef4444',
  border: '1px solid #3a1a1a',
  borderRadius: 4,
  padding: '4px 10px',
  fontSize: 12,
  cursor: 'pointer',
};

export const tbl = { width: '100%', borderCollapse: 'collapse' };

export const th = {
  textAlign: 'left',
  fontSize: 11,
  color: '#555',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  padding: '8px 12px',
  borderBottom: '1px solid #222',
};

export const td = {
  fontSize: 13,
  padding: '11px 12px',
  borderBottom: '1px solid #1a1a1a',
  color: '#e8e8e8',
  verticalAlign: 'middle',
};

export const sectionHead = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
};

export const grid2 = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

export const formCard = {
  background: '#111',
  border: '1px solid #222',
  borderRadius: 10,
  padding: 24,
  maxWidth: 760,
};
