'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { Field, inp, btnPrimary, btnGhost, btnDanger, grid2, formCard } from '../_ui';

const BLANK = {
  name: '', tagline: '', bio: '', location: '', email: '',
  avatar_url: '', resume_url: '', favicon_url: '',
  contact_blurb: '', github_url: '', linkedin_url: '', x_url: '',
};

export default function AboutTab() {
  const sb = useMemo(() => getSupabaseBrowser(), []);
  const [values, setValues] = useState(BLANK);
  const [rowId, setRowId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    sb.from('about').select('*').single().then(({ data }) => {
      if (data) {
        const r = data;
        setValues({
          name:          r.name          ?? '',
          tagline:       r.tagline       ?? '',
          bio:           r.bio           ?? '',
          location:      r.location      ?? '',
          email:         r.email         ?? '',
          avatar_url:    r.avatar_url    ?? '',
          resume_url:    r.resume_url    ?? '',
          favicon_url:   r.favicon_url   ?? '',
          contact_blurb: r.contact_blurb ?? '',
          github_url:    r.github_url    ?? '',
          linkedin_url:  r.linkedin_url  ?? '',
          x_url:         r.x_url         ?? '',
        });
        setRowId(r.id);
      }
    });
  }, [sb]);

  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  async function handleFaviconUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFavicon(true);
    const ext = file.name.split('.').pop();
    const filePath = `favicons/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('project-images').upload(filePath, file, { upsert: true });
    if (!error) {
      const { data: urlData } = sb.storage.from('project-images').getPublicUrl(filePath);
      set('favicon_url', urlData.publicUrl);
    }
    setUploadingFavicon(false);
    e.target.value = '';
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...values, updated_at: new Date().toISOString() };
    if (rowId) {
      await sb.from('about').update(payload).eq('id', rowId);
    } else {
      const { data } = await sb.from('about').insert(payload).select().single();
      if (data) setRowId(data.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>About</h2>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#555' }}>Single row — edits update in place</p>
      </div>

      <form onSubmit={save} style={formCard}>
        <div style={{ ...grid2, marginBottom: 16 }}>
          <Field label="Name">
            <input style={inp} value={values.name} onChange={e => set('name', e.target.value)} />
          </Field>
          <Field label="Email">
            <input style={inp} type="email" value={values.email} onChange={e => set('email', e.target.value)} />
          </Field>
        </div>

        <Field label="Tagline" style={{ marginBottom: 16 }}>
          <input style={inp} value={values.tagline} onChange={e => set('tagline', e.target.value)} />
        </Field>

        <Field label="Bio" style={{ marginBottom: 16 }}>
          <textarea
            style={{ ...inp, height: 120, resize: 'vertical' }}
            value={values.bio}
            onChange={e => set('bio', e.target.value)}
          />
        </Field>

        <div style={{ ...grid2, marginBottom: 16 }}>
          <Field label="Location">
            <input style={inp} value={values.location} onChange={e => set('location', e.target.value)} />
          </Field>
          <Field label="Avatar URL">
            <input style={inp} type="url" value={values.avatar_url} onChange={e => set('avatar_url', e.target.value)} />
          </Field>
        </div>

        <Field label="Resume URL" style={{ marginBottom: 16 }}>
          <input style={inp} type="url" value={values.resume_url} onChange={e => set('resume_url', e.target.value)} />
        </Field>

        <Field label="Contact blurb" style={{ marginBottom: 16 }}>
          <textarea
            style={{ ...inp, height: 70, resize: 'vertical' }}
            value={values.contact_blurb}
            onChange={e => set('contact_blurb', e.target.value)}
            placeholder="Short intro shown in the contact section…"
          />
        </Field>

        <div style={{ ...grid2, marginBottom: 16 }}>
          <Field label="GitHub URL">
            <input style={inp} type="url" value={values.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/yourname" />
          </Field>
          <Field label="LinkedIn URL">
            <input style={inp} type="url" value={values.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/yourname" />
          </Field>
        </div>

        <Field label="X (Twitter) URL" style={{ marginBottom: 16 }}>
          <input style={inp} type="url" value={values.x_url} onChange={e => set('x_url', e.target.value)} placeholder="https://x.com/yourname" />
        </Field>

        <Field label="Site favicon / tab icon" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {values.favicon_url && (
              <img src={values.favicon_url} alt="favicon" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain', background: '#fff', border: '1px solid #333' }} />
            )}
            <label style={{ ...btnGhost, cursor: 'pointer', fontSize: 12, padding: '6px 12px' }}>
              {uploadingFavicon ? 'Uploading…' : values.favicon_url ? 'Replace' : 'Upload icon'}
              <input type="file" accept="image/png,image/svg+xml,image/ico,image/x-icon,image/jpeg,image/webp" style={{ display: 'none' }} onChange={handleFaviconUpload} disabled={uploadingFavicon} />
            </label>
            {values.favicon_url && (
              <button type="button" style={{ ...btnDanger, fontSize: 11 }} onClick={() => set('favicon_url', '')}>Remove</button>
            )}
            <span style={{ fontSize: 11, color: '#555' }}>PNG or SVG recommended · 32×32 or 64×64</span>
          </div>
        </Field>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={btnPrimary} type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span style={{ fontSize: 12, color: '#4ade80' }}>Saved ✓</span>}
        </div>
      </form>
    </div>
  );
}
