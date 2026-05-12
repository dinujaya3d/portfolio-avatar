'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { Field, inp, btnPrimary, btnGhost, btnSm, btnDanger, tbl, th, td, sectionHead, grid2, formCard } from '../_ui';

const BLANK = {
  slug: '', title: '', description: '', long_description: '',
  content: '', tech_stack: '', live_url: '', github_url: '',
  cover_image: '', featured: false, order_index: 0,
};

export default function ProjectsTab() {
  const sb = useMemo(() => getSupabaseBrowser(), []);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');

  const load = useCallback(async () => {
    const { data } = await sb.from('projects').select('*').order('order_index');
    setItems(data || []);
  }, [sb]);

  const loadImages = useCallback(async (slug) => {
    if (!slug) return;
    const { data, error } = await sb.storage.from('project-images').list(slug, {
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) { console.error('loadImages:', error.message); return; }
    const files = (data || []).filter(f => f.name !== '.emptyFolderPlaceholder');
    setImages(
      files.map(file => {
        const filePath = `${slug}/${file.name}`;
        const { data: urlData } = sb.storage.from('project-images').getPublicUrl(filePath);
        return { name: file.name, url: urlData.publicUrl };
      })
    );
  }, [sb]);

  useEffect(() => { load(); }, [load]);

  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  function openAdd() { setValues(BLANK); setEditId(null); setImages([]); setOpen(true); }
  function openEdit(p) {
    setValues({ ...p, tech_stack: (p.tech_stack || []).join(', ') });
    setEditId(p.id);
    setOpen(true);
    loadImages(p.slug);
  }
  function cancel() { setOpen(false); setEditId(null); setImages([]); }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !values.slug) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${values.slug}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('project-images').upload(filePath, file, { upsert: true });
    if (error) console.error('upload:', error.message);
    else await loadImages(values.slug);
    setUploading(false);
    e.target.value = '';
  }

  async function copyUrl(url) {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const { id: _id, created_at: _ca, ...rest } = values;
    const payload = {
      ...rest,
      tech_stack: values.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
    };
    if (editId) {
      await sb.from('projects').update(payload).eq('id', editId);
    } else {
      await sb.from('projects').insert(payload);
    }
    setSaving(false);
    setOpen(false);
    load();
  }

  async function del(id) {
    if (!confirm('Delete this project?')) return;
    await sb.from('projects').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div style={sectionHead}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Projects</h2>
        {!open && (
          <button style={btnPrimary} onClick={openAdd}>+ Add project</button>
        )}
      </div>

      {!open && (
        <table style={tbl}>
          <thead>
            <tr>
              <th style={th}>Title</th>
              <th style={th}>Slug</th>
              <th style={th}>Featured</th>
              <th style={th}>Order</th>
              <th style={th} />
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id}>
                <td style={td}>{p.title}</td>
                <td style={{ ...td, color: '#666' }}>{p.slug}</td>
                <td style={td}>{p.featured ? '✓' : '–'}</td>
                <td style={{ ...td, color: '#666' }}>{p.order_index}</td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button style={btnSm} onClick={() => openEdit(p)}>Edit</button>
                  <button style={{ ...btnDanger, marginLeft: 8 }} onClick={() => del(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} style={{ ...td, color: '#444', textAlign: 'center', padding: 32 }}>No projects yet</td></tr>
            )}
          </tbody>
        </table>
      )}

      {open && (
        <form onSubmit={save} style={formCard}>
          <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600 }}>
            {editId ? 'Edit project' : 'New project'}
          </h3>

          <div style={{ ...grid2, marginBottom: 16 }}>
            <Field label="Slug">
              <input style={inp} value={values.slug} onChange={e => set('slug', e.target.value)} required />
            </Field>
            <Field label="Title">
              <input style={inp} value={values.title} onChange={e => set('title', e.target.value)} required />
            </Field>
          </div>

          <Field label="Description (short)" style={{ marginBottom: 16 }}>
            <input style={inp} value={values.description} onChange={e => set('description', e.target.value)} />
          </Field>

          <Field label="Long description" style={{ marginBottom: 16 }}>
            <textarea
              style={{ ...inp, height: 90, resize: 'vertical' }}
              value={values.long_description ?? ''}
              onChange={e => set('long_description', e.target.value)}
            />
          </Field>

          <Field label="Content (Markdown)" style={{ marginBottom: 16 }}>
            <textarea
              style={{ ...inp, height: 280, resize: 'vertical', fontFamily: 'var(--mono, monospace)', fontSize: 12 }}
              value={values.content ?? ''}
              onChange={e => set('content', e.target.value)}
              placeholder="Write full project detail in Markdown. Paste a YouTube or video URL on its own line to embed it."
            />
          </Field>

          <div style={{ ...grid2, marginBottom: 16 }}>
            <Field label="Live URL">
              <input style={inp} type="url" value={values.live_url} onChange={e => set('live_url', e.target.value)} />
            </Field>
            <Field label="GitHub URL">
              <input style={inp} type="url" value={values.github_url} onChange={e => set('github_url', e.target.value)} />
            </Field>
          </div>

          <div style={{ ...grid2, marginBottom: 16 }}>
            <Field label="Cover image URL">
              <input style={inp} type="url" value={values.cover_image} onChange={e => set('cover_image', e.target.value)} />
            </Field>
            <Field label="Tech stack (comma-separated)">
              <input style={inp} value={values.tech_stack} onChange={e => set('tech_stack', e.target.value)} />
            </Field>
          </div>

          <div style={{ display: 'flex', gap: 24, marginBottom: 20, alignItems: 'center' }}>
            <Field label="Order index" style={{ width: 120 }}>
              <input style={{ ...inp, width: 120 }} type="number" value={values.order_index} onChange={e => set('order_index', +e.target.value)} />
            </Field>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#aaa', marginTop: 18 }}>
              <input type="checkbox" checked={values.featured} onChange={e => set('featured', e.target.checked)} />
              Featured
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button style={btnPrimary} type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button style={btnGhost} type="button" onClick={cancel}>Cancel</button>
          </div>

          {/* ── Image uploader ── */}
          {values.slug && (
            <div style={{ borderTop: '1px solid #222', marginTop: 28, paddingTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Project images · <code style={{ fontFamily: 'monospace', fontWeight: 400 }}>{values.slug}/</code>
                </span>
                <label style={{
                  ...btnSm,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.5 : 1,
                  position: 'relative',
                  display: 'inline-block',
                }}>
                  {uploading ? 'Uploading…' : '+ Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                  />
                </label>
              </div>

              {images.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {images.map(img => (
                    <div
                      key={img.url}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        background: '#0d0d0d',
                        border: '1px solid #1e1e1e',
                        borderRadius: 6,
                        padding: '8px 10px',
                      }}
                    >
                      <img
                        src={img.url}
                        alt=""
                        style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                      />
                      <span style={{
                        fontSize: 11,
                        color: '#555',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace',
                      }}>
                        {img.url}
                      </span>
                      <button
                        type="button"
                        style={{
                          ...btnSm,
                          flexShrink: 0,
                          color: copiedUrl === img.url ? '#4ade80' : undefined,
                          borderColor: copiedUrl === img.url ? '#166534' : undefined,
                        }}
                        onClick={() => copyUrl(img.url)}
                      >
                        {copiedUrl === img.url ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: '#333', margin: 0 }}>
                  No images yet — upload one to get a URL for your markdown.
                </p>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
