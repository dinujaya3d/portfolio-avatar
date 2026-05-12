'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { Field, inp, btnPrimary, btnGhost, btnSm, btnDanger, tbl, th, td, sectionHead, grid2, formCard } from '../_ui';

const BLANK = {
  slug: '', title: '', issuer: '', description: '',
  content: '', cover_image: '', date: '', featured: false, order_index: 0,
};

export default function AwardsTab() {
  const sb = useMemo(() => getSupabaseBrowser(), []);
  const [items, setItems]     = useState([]);
  const [values, setValues]   = useState(BLANK);
  const [editId, setEditId]   = useState(null);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data } = await sb.from('awards').select('*').order('order_index');
    setItems(data || []);
  }, [sb]);

  useEffect(() => { load(); }, [load]);

  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  function openAdd() { setValues(BLANK); setEditId(null); setOpen(true); }
  function openEdit(r) {
    setValues({
      slug: r.slug, title: r.title, issuer: r.issuer || '',
      description: r.description || '', content: r.content || '',
      cover_image: r.cover_image || '', date: r.date || '',
      featured: r.featured, order_index: r.order_index,
    });
    setEditId(r.id);
    setOpen(true);
  }
  function cancel() { setOpen(false); setEditId(null); }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `awards/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('project-images').upload(filePath, file, { upsert: true });
    if (!error) {
      const { data: urlData } = sb.storage.from('project-images').getPublicUrl(filePath);
      set('cover_image', urlData.publicUrl);
    }
    setUploading(false);
    e.target.value = '';
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const { ...payload } = values;
    if (editId) {
      await sb.from('awards').update(payload).eq('id', editId);
    } else {
      await sb.from('awards').insert(payload);
    }
    setSaving(false);
    setOpen(false);
    load();
  }

  async function del(id) {
    if (!confirm('Delete this award?')) return;
    await sb.from('awards').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div style={sectionHead}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Awards & Achievements</h2>
        {!open && <button style={btnPrimary} onClick={openAdd}>+ Add award</button>}
      </div>

      {!open && (
        <table style={tbl}>
          <thead>
            <tr>
              <th style={th}>Cover</th>
              <th style={th}>Title</th>
              <th style={th}>Issuer</th>
              <th style={th}>Date</th>
              <th style={th}>Featured</th>
              <th style={th}>Order</th>
              <th style={th} />
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id}>
                <td style={td}>
                  {r.cover_image
                    ? <img src={r.cover_image} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', border: '1px solid #333' }} />
                    : <span style={{ color: '#555', fontSize: 14 }}>★</span>}
                </td>
                <td style={td}>{r.title}</td>
                <td style={{ ...td, color: '#888' }}>{r.issuer || '—'}</td>
                <td style={{ ...td, color: '#666', fontSize: 12 }}>{r.date || '—'}</td>
                <td style={td}>{r.featured ? '✓' : '–'}</td>
                <td style={{ ...td, color: '#666' }}>{r.order_index}</td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button style={btnSm} onClick={() => openEdit(r)}>Edit</button>
                  <button style={{ ...btnDanger, marginLeft: 8 }} onClick={() => del(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} style={{ ...td, color: '#444', textAlign: 'center', padding: 32 }}>No awards yet</td></tr>
            )}
          </tbody>
        </table>
      )}

      {open && (
        <form onSubmit={save} style={formCard}>
          <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600 }}>
            {editId ? 'Edit award' : 'New award'}
          </h3>

          <div style={{ ...grid2, marginBottom: 16 }}>
            <Field label="Slug (used in URL)">
              <input style={inp} value={values.slug} onChange={e => set('slug', e.target.value)} required placeholder="best-paper-award" />
            </Field>
            <Field label="Title">
              <input style={inp} value={values.title} onChange={e => set('title', e.target.value)} required />
            </Field>
          </div>

          <div style={{ ...grid2, marginBottom: 16 }}>
            <Field label="Issuer / Organisation">
              <input style={inp} value={values.issuer} onChange={e => set('issuer', e.target.value)} placeholder="IEEE, University of…" />
            </Field>
            <Field label="Date">
              <input style={inp} type="date" value={values.date} onChange={e => set('date', e.target.value)} />
            </Field>
          </div>

          <Field label="Short description" style={{ marginBottom: 16 }}>
            <input style={inp} value={values.description} onChange={e => set('description', e.target.value)} placeholder="One sentence shown on the card" />
          </Field>

          <Field label="Cover image" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {values.cover_image && (
                <img src={values.cover_image} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #333' }} />
              )}
              <label style={{ ...btnGhost, cursor: 'pointer', fontSize: 12, padding: '6px 12px' }}>
                {uploading ? 'Uploading…' : values.cover_image ? 'Replace' : 'Upload cover'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} disabled={uploading} />
              </label>
              {values.cover_image && (
                <button type="button" style={{ ...btnDanger, fontSize: 11 }} onClick={() => set('cover_image', '')}>Remove</button>
              )}
            </div>
          </Field>

          <Field label="Content (Markdown)" style={{ marginBottom: 16 }}>
            <textarea
              style={{ ...inp, height: 320, resize: 'vertical', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }}
              value={values.content}
              onChange={e => set('content', e.target.value)}
              placeholder={'# About this award\n\nWrite the full story in **Markdown**.'}
            />
          </Field>

          <div style={{ display: 'flex', gap: 24, marginBottom: 20, alignItems: 'center' }}>
            <Field label="Order index" style={{ width: 120 }}>
              <input style={{ ...inp, width: 120 }} type="number" value={values.order_index} onChange={e => set('order_index', +e.target.value)} />
            </Field>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#aaa', marginTop: 18 }}>
              <input type="checkbox" checked={values.featured} onChange={e => set('featured', e.target.checked)} />
              Show on homepage
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button style={btnPrimary} type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button style={btnGhost} type="button" onClick={cancel}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
