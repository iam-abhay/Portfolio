import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Fetch published projects from Supabase ordered by display_order.
 * Returns normalized array of projects matching UI component shape.
 */
export async function fetchProjects() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured. Please check environment variables.');
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map((project) => ({
    ...project,
    id: project.id || project.slug,
    short_description: project.short_description || project.description,
  }));
}
