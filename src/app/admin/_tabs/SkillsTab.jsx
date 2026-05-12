'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { Field, inp, btnPrimary, btnGhost, btnSm, btnDanger, tbl, th, td, sectionHead, grid2, formCard } from '../_ui';

const BLANK = { name: '', category: '', order_index: 0 };

export default function SkillsTab() {
  const sb = useMemo(() => getSupabaseBrowser(), []);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await sb.from('skills').select('*').order('category').order('order_index');
    setItems(data || []);
  }, [sb]);

  useEffect(() => { load(); }, [load]);

  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  function openAdd() { setValues(BLANK); setEditId(null); setOpen(true); }
  function openEdit(r) { setValues(r); setEditId(r.id); setOpen(true); }
  function cancel() { setOpen(false); setEditId(null); }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const { id: _id, ...payload } = values;
    if (editId) {
      await sb.from('skills').update(payload).eq('id', editId);
    } else {
      await sb.from('skills').insert(payload);
    }
    setSaving(false);
    setOpen(false);
    load();
  }

  async function del(id) {
    if (!confirm('Delete this skill?')) return;
    await sb.from('skills').delete().eq('id', id);
    load();
  }

  const grouped = items.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div>
      <div style={sectionHead}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Skills</h2>
        {!open && <button style={btnPrimary} onClick={openAdd}>+ Add skill</button>}
      </div>

      {!open && (
        <table style={tbl}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Category</th>
              <th style={th}>Order</th>
              <th style={th} />
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([cat, skills]) => (
              <>
                <tr key={`hd-${cat}`}>
                  <td
                    colSpan={4}
                    style={{ ...td, color: '#444', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: 20, paddingBottom: 6, borderBottom: 'none' }}
                  >
                    {cat}
                  </td>
                </tr>
                {skills.map(s => (
                  <tr key={s.id}>
                    <td style={td}>{s.name}</td>
                    <td style={{ ...td, color: '#666' }}>{s.category}</td>
                    <td style={{ ...td, color: '#666' }}>{s.order_index}</td>
                    <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button style={btnSm} onClick={() => openEdit(s)}>Edit</button>
                      <button style={{ ...btnDanger, marginLeft: 8 }} onClick={() => del(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} style={{ ...td, color: '#444', textAlign: 'center', padding: 32 }}>No skills yet</td></tr>
            )}
          </tbody>
        </table>
      )}

      {open && (
        <form onSubmit={save} style={formCard}>
          <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600 }}>
            {editId ? 'Edit skill' : 'New skill'}
          </h3>

          <div style={{ ...grid2, marginBottom: 16 }}>
            <Field label="Skill name">
              <input style={inp} value={values.name} onChange={e => set('name', e.target.value)} required />
            </Field>
            <Field label="Category">
              <input style={inp} value={values.category} onChange={e => set('category', e.target.value)} required placeholder="e.g. Frontend, Backend" />
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
