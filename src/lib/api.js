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

/**
 * Fetch visible skills from Supabase and group them into category objects
 * matching the shape expected by Skills.jsx.
 */
export async function fetchSkills() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured. Please check environment variables.');
  }

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return groupSkillsByCategory(data || []);
}

function getCategoryId(categoryName) {
  const map = {
    'Programming Languages': 'languages',
    'Backend Development': 'backend',
    'Frontend Development': 'frontend',
    'Database': 'database',
    'Cloud & DevOps': 'cloud-devops',
    'Tools & IDEs': 'tools',
    'AI-Assisted Development': 'ai-dev',
    'Core CS Concepts': 'core-concepts'
  };
  return map[categoryName] || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function groupSkillsByCategory(skillsData) {
  const categoriesMap = new Map();

  for (const skillRow of skillsData) {
    const catName = skillRow.category || 'General';
    if (!categoriesMap.has(catName)) {
      categoriesMap.set(catName, {
        id: getCategoryId(catName),
        name: catName,
        skills: []
      });
    }
    categoriesMap.get(catName).skills.push(skillRow.name);
  }

  return Array.from(categoriesMap.values());
}
