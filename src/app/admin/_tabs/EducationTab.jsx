'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { Field, inp, btnPrimary, btnGhost, btnSm, btnDanger, tbl, th, td, sectionHead, grid2, formCard } from '../_ui';

const BLANK = { institution: '', degree: '', field: '', description: '', start_year: '', end_year: '', order_index: 0, logo_url: '' };

export default function EducationTab() {
  const sb = useMemo(() => getSupabaseBrowser(), []);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data } = await sb.from('education').select('*').order('order_index');
    setItems(data || []);
  }, [sb]);

  useEffect(() => { load(); }, [load]);

  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  function openAdd() { setValues(BLANK); setEditId(null); setOpen(true); }
  function openEdit(r) { setValues(r); setEditId(r.id); setOpen(true); }
  function cancel() { setOpen(false); setEditId(null); }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `logos/edu/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('project-images').upload(filePath, file, { upsert: true });
    if (!error) {
      const { data: urlData } = sb.storage.from('project-images').getPublicUrl(filePath);
      set('logo_url', urlData.publicUrl);
    }
    setUploading(false);
    e.target.value = '';
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const { id: _id, ...payload } = values;
    if (editId) {
      await sb.from('education').update(payload).eq('id', editId);
    } else {
      await sb.from('education').insert(payload);
    }
    setSaving(false);
    setOpen(false);
    load();
  }

  async function del(id) {
    if (!confirm('Delete this education entry?')) return;
    await sb.from('education').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div style={sectionHead}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Education</h2>
        {!open && <button style={btnPrimary} onClick={openAdd}>+ Add education</button>}
      </div>

      {!open && (
        <table style={tbl}>
          <thead>
            <tr>
              <th style={th}>Logo</th>
              <th style={th}>Degree</th>
              <th style={th}>Institution</th>
              <th style={th}>Field</th>
              <th style={th}>Years</th>
              <th style={th} />
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id}>
                <td style={td}>
                  {r.logo_url
                    ? <img src={r.logo_url} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', background: '#fff', border: '1px solid #333' }} />
                    : <span style={{ color: '#555', fontSize: 11 }}>—</span>}
                </td>
                <td style={td}>{r.degree}</td>
                <td style={{ ...td, color: '#888' }}>{r.institution}</td>
                <td style={{ ...td, color: '#666' }}>{r.field}</td>
                <td style={{ ...td, color: '#666', fontSize: 12 }}>{r.start_year} – {r.end_year || 'Present'}</td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button style={btnSm} onClick={() => openEdit(r)}>Edit</button>
                  <button style={{ ...btnDanger, marginLeft: 8 }} onClick={() => del(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} style={{ ...td, color: '#444', textAlign: 'center', padding: 32 }}>No education yet</td></tr>
            )}
          </tbody>
        </table>
      )}

      {open && (
        <form onSubmit={save} style={formCard}>
          <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600 }}>
            {editId ? 'Edit education' : 'New education'}
          </h3>

          <Field label="Institution logo" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {values.logo_url && (
                <img src={values.logo_url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', background: '#fff', border: '1px solid #333' }} />
              )}
              <label style={{ ...btnGhost, cursor: 'pointer', fontSize: 12, padding: '6px 12px' }}>
                {uploading ? 'Uploading…' : values.logo_url ? 'Replace' : 'Upload logo'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} disabled={uploading} />
              </label>
              {values.logo_url && (
                <button type="button" style={{ ...btnDanger, fontSize: 11 }} onClick={() => set('logo_url', '')}>Remove</button>
              )}
            </div>
          </Field>

          <div style={{ ...grid2, marginBottom: 16 }}>
            <Field label="Institution">
              <input style={inp} value={values.institution} onChange={e => set('institution', e.target.value)} required />
            </Field>
            <Field label="Degree">
              <input style={inp} value={values.degree} onChange={e => set('degree', e.target.value)} required />
            </Field>
          </div>

          <Field label="Field of study" style={{ marginBottom: 16 }}>
            <input style={inp} value={values.field} onChange={e => set('field', e.target.value)} />
          </Field>

          <Field label="Description" style={{ marginBottom: 16 }}>
            <textarea
              style={{ ...inp, height: 90, resize: 'vertical' }}
              value={values.description ?? ''}
              onChange={e => set('description', e.target.value)}
            />
          </Field>

          <div style={{ ...grid2, marginBottom: 20 }}>
            <Field label="Start year">
              <input style={inp} type="number" min="1900" max="2100" value={values.start_year} onChange={e => set('start_year', +e.target.value)} />
            </Field>
            <Field label="End year (blank = present)">
              <input style={inp} type="number" min="1900" max="2100" value={values.end_year} onChange={e => set('end_year', e.target.value === '' ? '' : +e.target.value)} />
            </Field>
          </div>

          <Field label="Order index" style={{ width: 120, marginBottom: 20 }}>
            <input style={{ ...inp, width: 120 }} type="number" value={values.order_index} onChange={e => set('order_index', +e.target.value)} />
          </Field>

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
