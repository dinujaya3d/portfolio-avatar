import { supabase } from './supabase';

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getFeaturedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

export async function getAbout() {
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data.reduce((acc, skill) => {
    const cat = skill.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});
}

export async function getExperience() {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getEducation() {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAwards() {
  const { data, error } = await supabase
    .from('awards')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getFeaturedAwards() {
  const { data, error } = await supabase
    .from('awards')
    .select('*')
    .eq('featured', true)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAwardBySlug(slug) {
  const { data, error } = await supabase
    .from('awards')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

export async function getContentPage(slug) {
  const { data } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', slug)
    .single();
  return data || { slug, title: slug.charAt(0).toUpperCase() + slug.slice(1), description: null };
}

export async function getContentItems(pageSlug) {
  const { data } = await supabase
    .from('content_items')
    .select('*')
    .eq('page_slug', pageSlug)
    .order('order_index', { ascending: true });
  return data || [];
}

export async function getContentItem(id) {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
