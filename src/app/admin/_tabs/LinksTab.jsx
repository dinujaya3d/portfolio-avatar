'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { Field, inp, btnPrimary, btnGhost, btnSm, btnDanger, tbl, th, td, sectionHead, formCard } from '../_ui';

const BLANK = { slug: '', destination: '', label: '', is_file: false };

const SQL_SETUP = `-- Run once in Supabase SQL editor
CREATE TABLE IF NOT EXISTS links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  destination text NOT NULL,
  label text,
  is_file boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON links FOR SELECT USING (true);
CREATE POLICY "auth write" ON links FOR ALL USING (auth.role() = 'authenticated');

-- If the table already exists, add the column:
-- ALTER TABLE links ADD COLUMN IF NOT EXISTS is_file boolean DEFAULT false;`;

export default function LinksTab() {
  const sb = useMemo(() => getSupabaseBrowser(), []);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [tableError, setTableError] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await sb.from('links').select('*').order('created_at', { ascending: false });
    if (error) { setTableError(true); return; }
    setTableError(false);
    setItems(data || []);
  }, [sb]);

  useEffect(() => { load(); }, [load]);

  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  function openAdd() { setValues(BLANK); setEditId(null); setOpen(true); }
  function openEdit(l) { setValues(l); setEditId(l.id); setOpen(true); }
  function cancel() { setOpen(false); setEditId(null); }

  async function copyShortUrl(slug) {
    const url = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(''), 2000);
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, '_')}`;
    const { error } = await sb.storage.from('link-files').upload(path, file, { upsert: false });
    if (error) {
      alert('Upload failed: ' + error.message);
    } else {
      const { data: urlData } = sb.storage.from('link-files').getPublicUrl(path);
      setValues(prev => ({
        ...prev,
        destination: urlData.publicUrl,
        is_file: true,
        label: prev.label || file.name.replace(`.${ext}`, ''),
      }));
    }
    setUploading(false);
    e.target.value = '';
  }

  async function save(e) {
    e.preventDefault();
    if (!values.slug || !values.destination) return;
    setSaving(true);
    const payload = {
      slug: values.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      destination: values.destination,
      label: values.label || null,
      is_file: values.is_file,
    };
    if (editId) {
      await sb.from('links').update(payload).eq('id', editId);
    } else {
      await sb.from('links').insert(payload);
    }
    setSaving(false);
    setOpen(false);
    load();
  }

  async function del(id) {
    if (!confirm('Delete this link?')) return;
    await sb.from('links').delete().eq('id', id);
    load();
  }

  const slugPreview = values.slug
    ? values.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-')
    : '';

  return (
    <div>
      <div style={sectionHead}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Short Links</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...btnGhost, fontSize: 12 }} onClick={() => setShowSql(s => !s)}>
            {showSql ? 'Hide SQL' : 'DB setup'}
          </button>
          {!open && (
            <button style={btnPrimary} onClick={openAdd}>+ Add link</button>
          )}
        </div>
      </div>

      {showSql && (
        <pre style={{
          background: '#0d0d0d',
          border: '1px solid #222',
          borderRadius: 8,
          padding: '16px 20px',
          fontSize: 12,
          color: '#aaa',
          fontFamily: 'monospace',
          overflowX: 'auto',
          marginBottom: 24,
          whiteSpace: 'pre',
        }}>
          {SQL_SETUP}
        </pre>
      )}

      {tableError && (
        <div style={{ background: '#1a0e0e', border: '1px solid #3a1a1a', borderRadius: 8, padding: '14px 18px', marginBottom: 20, fontSize: 13, color: '#ef4444' }}>
          Table not found. Click <strong>DB setup</strong> above and run the SQL in your Supabase SQL editor first.
        </div>
      )}

      {!open && !tableError && (
        <table style={tbl}>
          <thead>
            <tr>
              <th style={th}>Slug</th>
              <th style={th}>Label</th>
              <th style={th}>Type</th>
              <th style={th}>Destination</th>
              <th style={th} />
            </tr>
          </thead>
          <tbody>
            {items.map(l => (
              <tr key={l.id}>
                <td style={{ ...td, fontFamily: 'monospace', color: '#aaa' }}>
                  /{l.slug}
                </td>
                <td style={{ ...td, color: '#888' }}>{l.label || '—'}</td>
                <td style={td}>
                  <span style={{
                    fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.06em',
                    padding: '2px 7px', borderRadius: 4,
                    background: l.is_file ? '#1a2a1a' : '#1a1a2a',
                    color: l.is_file ? '#4ade80' : '#7aa2f7',
                    border: `1px solid ${l.is_file ? '#2a4a2a' : '#2a2a4a'}`,
                  }}>
                    {l.is_file ? 'file' : 'redirect'}
                  </span>
                </td>
                <td style={{ ...td, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <a href={l.destination} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#555', textDecoration: 'none', fontSize: 12, fontFamily: 'monospace' }}
                  >
                    {l.destination}
                  </a>
                </td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button
                    style={{ ...btnSm, color: copiedSlug === l.slug ? '#4ade80' : undefined, borderColor: copiedSlug === l.slug ? '#166534' : undefined }}
                    onClick={() => copyShortUrl(l.slug)}
                  >
                    {copiedSlug === l.slug ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button style={{ ...btnSm, marginLeft: 6 }} onClick={() => openEdit(l)}>Edit</button>
                  <button style={{ ...btnDanger, marginLeft: 6 }} onClick={() => del(l.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} style={{ ...td, color: '#444', textAlign: 'center', padding: 32 }}>
                  No links yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {open && (
        <form onSubmit={save} style={formCard}>
          <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600 }}>
            {editId ? 'Edit link' : 'New link'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Slug">
              <input
                style={inp}
                value={values.slug}
                onChange={e => set('slug', e.target.value)}
                placeholder="instagram"
                required
              />
              {slugPreview && (
                <span style={{ fontSize: 11, color: '#444', fontFamily: 'monospace', marginTop: 4 }}>
                  → /{slugPreview}
                </span>
              )}
            </Field>
            <Field label="Label (optional)">
              <input
                style={inp}
                value={values.label}
                onChange={e => set('label', e.target.value)}
                placeholder="Instagram"
              />
            </Field>
          </div>

          <Field label="Destination URL" style={{ marginBottom: 20 }}>
            <input
              style={inp}
              type="url"
              value={values.destination}
              onChange={e => set('destination', e.target.value)}
              placeholder="https://instagram.com/yourhandle"
              required
            />
          </Field>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#aaa', marginBottom: 20, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={values.is_file}
              onChange={e => set('is_file', e.target.checked)}
            />
            Proxy file — keep <code style={{ fontFamily: 'monospace', fontSize: 12 }}>dinujaya.me/{slugPreview || 'slug'}</code> in the address bar instead of redirecting
          </label>

          {/* File upload — populates destination with the storage URL */}
          <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 18, marginBottom: 20 }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: '#555' }}>
              Or upload a file — the public URL will be set as the destination automatically.
            </p>
            <label style={{
              ...btnSm,
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.5 : 1,
              position: 'relative',
              display: 'inline-block',
            }}>
              {uploading ? 'Uploading…' : 'Upload file'}
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
              />
            </label>
            <span style={{ fontSize: 11, color: '#333', marginLeft: 12 }}>
              Stored in Supabase Storage → <code style={{ fontFamily: 'monospace' }}>link-files</code> bucket
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button style={btnPrimary} type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button style={btnGhost} type="button" onClick={cancel}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
