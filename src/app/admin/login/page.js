'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const sb = getSupabaseBrowser();
    const { error: err } = await sb.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      setBusy(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ width: 360, padding: 40, background: '#111', border: '1px solid #222', borderRadius: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e8e8e8', margin: '0 0 4px' }}>Admin</h1>
        <p style={{ fontSize: 13, color: '#555', margin: '0 0 32px' }}>Portfolio management</p>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Email</label>
            <input
              style={inp}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>Password</label>
            <input
              style={inp}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: '-12px 0 16px' }}>{error}</p>}

          <button
            type="submit"
            disabled={busy}
            style={{
              width: '100%',
              padding: 10,
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

const lbl = {
  display: 'block',
  fontSize: 11,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 6,
};

const inp = {
  display: 'block',
  width: '100%',
  padding: '9px 12px',
  background: '#161616',
  border: '1px solid #2a2a2a',
  borderRadius: 6,
  color: '#e8e8e8',
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none',
};
