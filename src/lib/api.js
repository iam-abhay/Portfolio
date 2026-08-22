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

/**
 * Format ISO date string 'YYYY-MM-DD' into human-readable month 'Mon YYYY'
 * e.g., '2025-01-01' => 'Jan 2025'
 */
function formatDateMonthYear(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Format ISO date string 'YYYY-MM-DD' into year 'YYYY'
 * e.g., '2022-01-01' => '2022'
 */
function formatDateYear(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.getFullYear().toString();
}

/**
 * Fetch experience records from Supabase
 */
export async function fetchExperience() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured. Please check environment variables.');
  }

  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map((exp) => ({
    ...exp,
    start_date: formatDateMonthYear(exp.start_date),
    end_date: formatDateMonthYear(exp.end_date),
  }));
}

/**
 * Fetch education records from Supabase
 */
export async function fetchEducation() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured. Please check environment variables.');
  }

  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map((edu) => {
    let grade = null;
    let description = edu.description || '';

    if (description.includes('. Grade: ')) {
      const parts = description.split('. Grade: ');
      description = parts[0];
      grade = parts[1] || null;
    } else if (description.includes('92.92%')) {
      grade = '92.92%';
    } else if (description.includes('94.60%')) {
      grade = '94.60%';
    }

    return {
      ...edu,
      start_date: formatDateYear(edu.start_date),
      end_date: formatDateYear(edu.end_date),
      grade: grade,
      description: description,
    };
  });
}
