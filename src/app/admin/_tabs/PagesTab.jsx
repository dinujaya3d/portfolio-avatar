'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { Field, inp, btnPrimary, btnGhost, btnSm, btnDanger, tbl, th, td, sectionHead, formCard } from '../_ui';

const PAGES = ['music', 'books', 'thoughts'];

const BLANK_ITEM = { title: '', subtitle: '', content: '', cover_image: '', order_index: 0 };
const BLANK_PAGE = { title: '', description: '' };

const PAGE_LABEL = { music: 'Music', books: 'Books', thoughts: 'Thoughts' };

export default function PagesTab() {
  const sb = useMemo(() => getSupabaseBrowser(), []);
  const [pageSlug, setPageSlug] = useState('music');
  const [pageInfo, setPageInfo] = useState(BLANK_PAGE);
  const [items, setItems]   = useState([]);
  const [itemValues, setItemValues] = useState(BLANK_ITEM);
  const [editItemId, setEditItemId] = useState(null);
  const [itemOpen, setItemOpen]     = useState(false);
  const [savingPage, setSavingPage] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [uploading, setUploading]   = useState(false);

  const loadPage = useCallback(async (slug) => {
    const { data } = await sb.from('content_pages').select('*').eq('slug', slug).single();
    setPageInfo(data ? { title: data.title, description: data.description || '' } : { title: PAGE_LABEL[slug], description: '' });
  }, [sb]);

  const loadItems = useCallback(async (slug) => {
    const { data } = await sb.from('content_items').select('*').eq('page_slug', slug).order('order_index');
    setItems(data || []);
  }, [sb]);

  useEffect(() => {
    setItemOpen(false);
    loadPage(pageSlug);
    loadItems(pageSlug);
  }, [pageSlug, loadPage, loadItems]);

  const setItem = (k, v) => setItemValues(prev => ({ ...prev, [k]: v }));

  async function savePage(e) {
    e.preventDefault();
    setSavingPage(true);
    await sb.from('content_pages').upsert({ slug: pageSlug, ...pageInfo }, { onConflict: 'slug' });
    setSavingPage(false);
  }

  function openAdd() {
    setItemValues(BLANK_ITEM);
    setEditItemId(null);
    setItemOpen(true);
  }

  function openEdit(r) {
    setItemValues({ title: r.title, subtitle: r.subtitle || '', content: r.content || '', cover_image: r.cover_image || '', order_index: r.order_index });
    setEditItemId(r.id);
    setItemOpen(true);
  }

  function cancelItem() { setItemOpen(false); setEditItemId(null); }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `content/${pageSlug}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('project-images').upload(filePath, file, { upsert: true });
    if (!error) {
      const { data: urlData } = sb.storage.from('project-images').getPublicUrl(filePath);
      setItem('cover_image', urlData.publicUrl);
    }
    setUploading(false);
    e.target.value = '';
  }

  async function saveItem(e) {
    e.preventDefault();
    setSavingItem(true);
    const payload = { ...itemValues, page_slug: pageSlug };
    if (editItemId) {
      await sb.from('content_items').update(payload).eq('id', editItemId);
    } else {
      await sb.from('content_items').insert(payload);
    }
    setSavingItem(false);
    setItemOpen(false);
    setEditItemId(null);
    loadItems(pageSlug);
  }

  async function delItem(id) {
    if (!confirm('Delete this item?')) return;
    await sb.from('content_items').delete().eq('id', id);
    loadItems(pageSlug);
  }

  return (
    <div>
      {/* Page selector */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e1e1e', marginBottom: 28 }}>
        {PAGES.map(p => (
          <button
            key={p}
            onClick={() => setPageSlug(p)}
            style={{
              fontSize: 13, padding: '10px 18px',
              background: 'none', border: 'none',
              borderBottom: pageSlug === p ? '2px solid #e8e8e8' : '2px solid transparent',
              color: pageSlug === p ? '#e8e8e8' : '#555',
              cursor: 'pointer', marginBottom: -1,
            }}
          >
            {PAGE_LABEL[p]}
          </button>
        ))}
      </div>

      {/* Page info editor */}
      <form onSubmit={savePage} style={{ ...formCard, marginBottom: 32 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 600, color: '#999' }}>
          Page info — {PAGE_LABEL[pageSlug]}
        </h3>
        <Field label="Page title" style={{ marginBottom: 12 }}>
          <input style={inp} value={pageInfo.title} onChange={e => setPageInfo(p => ({ ...p, title: e.target.value }))} required />
        </Field>
        <Field label="Page description" style={{ marginBottom: 16 }}>
          <textarea
            style={{ ...inp, height: 70, resize: 'vertical' }}
            value={pageInfo.description}
            onChange={e => setPageInfo(p => ({ ...p, description: e.target.value }))}
            placeholder="Brief intro shown at the top of the page…"
          />
        </Field>
        <button style={btnPrimary} type="submit" disabled={savingPage}>
          {savingPage ? 'Saving…' : 'Save page info'}
        </button>
      </form>

      {/* Items list */}
      {!itemOpen && (
        <>
          <div style={sectionHead}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{PAGE_LABEL[pageSlug]} items</h2>
            <button style={btnPrimary} onClick={openAdd}>+ Add item</button>
          </div>

          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Cover</th>
                <th style={th}>Title</th>
                <th style={th}>Subtitle</th>
                <th style={th}>Order</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id}>
                  <td style={td}>
                    {r.cover_image
                      ? <img src={r.cover_image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid #333' }} />
                      : <span style={{ color: '#555', fontSize: 11 }}>—</span>}
                  </td>
                  <td style={td}>{r.title}</td>
                  <td style={{ ...td, color: '#888' }}>{r.subtitle || '—'}</td>
                  <td style={{ ...td, color: '#666' }}>{r.order_index}</td>
                  <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button style={btnSm} onClick={() => openEdit(r)}>Edit</button>
                    <button style={{ ...btnDanger, marginLeft: 8 }} onClick={() => delItem(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ ...td, color: '#444', textAlign: 'center', padding: 32 }}>No items yet</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Item form */}
      {itemOpen && (
        <form onSubmit={saveItem} style={formCard}>
          <h3 style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600 }}>
            {editItemId ? 'Edit item' : 'New item'} — {PAGE_LABEL[pageSlug]}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Title">
              <input style={inp} value={itemValues.title} onChange={e => setItem('title', e.target.value)} required />
            </Field>
            <Field label="Subtitle">
              <input
                style={inp}
                value={itemValues.subtitle}
                onChange={e => setItem('subtitle', e.target.value)}
                placeholder={pageSlug === 'music' ? 'Artist name…' : pageSlug === 'books' ? 'Author name…' : 'Date or tag…'}
              />
            </Field>
          </div>

          <Field label="Cover image" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {itemValues.cover_image && (
                <img src={itemValues.cover_image} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #333' }} />
              )}
              <label style={{ ...btnGhost, cursor: 'pointer', fontSize: 12, padding: '6px 12px' }}>
                {uploading ? 'Uploading…' : itemValues.cover_image ? 'Replace' : 'Upload cover'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} disabled={uploading} />
              </label>
              {itemValues.cover_image && (
                <button type="button" style={{ ...btnDanger, fontSize: 11 }} onClick={() => setItem('cover_image', '')}>Remove</button>
              )}
            </div>
          </Field>

          <Field label="Content (Markdown supported)" style={{ marginBottom: 16 }}>
            <textarea
              style={{ ...inp, height: 360, resize: 'vertical', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }}
              value={itemValues.content}
              onChange={e => setItem('content', e.target.value)}
              placeholder={'# Heading\n\nWrite in **Markdown**. Use ##, ###, -, *, > blockquotes, `code`, etc.'}
            />
          </Field>

          <Field label="Order index" style={{ width: 120, marginBottom: 20 }}>
            <input style={{ ...inp, width: 120 }} type="number" value={itemValues.order_index} onChange={e => setItem('order_index', +e.target.value)} />
          </Field>

          <div style={{ display: 'flex', gap: 10 }}>
            <button style={btnPrimary} type="submit" disabled={savingItem}>{savingItem ? 'Saving…' : 'Save'}</button>
            <button style={btnGhost} type="button" onClick={cancelItem}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
