import { supabase, isSupabaseConfigured } from './supabase';

function checkSupabaseConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured. Please check environment variables.');
  }
}

/* ==========================================================================
   PROFILE MANAGEMENT
   ========================================================================== */

/**
 * Fetch profile record for Admin Dashboard.
 */
export async function fetchAdminProfile() {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    throw new Error(`Failed to fetch admin profile: ${error.message}`);
  }

  return (data && data.length > 0) ? data[0] : null;
}

/**
 * Updates or inserts the portfolio profile record.
 * Handles normalization between frontend form properties and database schema columns.
 */
export async function updateProfile(profileData) {
  checkSupabaseConfigured();

  const payload = {
    name: profileData.name,
    headline: profileData.headline,
    short_bio: profileData.short_bio || profileData.subtext || null,
    about: profileData.about,
    email: profileData.email,
    phone: profileData.phone || null,
    github_url: profileData.github_url || profileData.github || null,
    linkedin_url: profileData.linkedin_url || profileData.linkedin || null,
    resume_url: profileData.resume_url || profileData.resumeUrl || null,
    profile_image_url: profileData.profile_image_url || profileData.profileImageUrl || null,
    updated_at: new Date().toISOString(),
  };

  // Fetch existing profile ID to perform targeted update or insert
  const { data: existingProfiles, error: fetchError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);

  if (fetchError) {
    throw new Error(`Failed to check existing profile: ${fetchError.message}`);
  }

  if (existingProfiles && existingProfiles.length > 0) {
    const profileId = profileData.id || existingProfiles[0].id;
    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    return data;
  } else {
    const { data, error } = await supabase
      .from('profiles')
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
    return data;
  }
}

/* ==========================================================================
   PROJECTS MANAGEMENT
   ========================================================================== */

/**
 * Fetch ALL projects for Admin Dashboard (includes both published and draft records).
 */
export async function fetchAdminProjects() {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch admin projects: ${error.message}`);
  }
  return data || [];
}

/**
 * Create a new project record in Supabase.
 */
export async function createProject(projectData) {
  checkSupabaseConfigured();

  const payload = {
    title: projectData.title,
    slug: projectData.slug || projectData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    category: projectData.category,
    secondary_category: projectData.secondary_category || projectData.secondaryCategory || null,
    short_description: projectData.short_description || projectData.shortDescription || projectData.description,
    description: projectData.description,
    technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [],
    github_url: projectData.github_url || projectData.githubUrl || null,
    live_url: projectData.live_url || projectData.liveUrl || null,
    image_url: projectData.image_url || projectData.imageUrl || null,
    featured: Boolean(projectData.featured),
    published: projectData.published !== undefined ? Boolean(projectData.published) : true,
    display_order: projectData.display_order ?? projectData.displayOrder ?? 0,
    metrics: projectData.metrics || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
  return data;
}

/**
 * Update an existing project record in Supabase by ID.
 */
export async function updateProject(id, projectData) {
  checkSupabaseConfigured();

  const payload = {
    ...projectData,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }
  return data;
}

/**
 * Delete a project record from Supabase by ID.
 */
export async function deleteProject(id) {
  checkSupabaseConfigured();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }
  return { success: true, id };
}

/**
 * Upload a project image file to Supabase Storage bucket 'portfolio-images'.
 */
export async function uploadProjectImage(file) {
  checkSupabaseConfigured();

  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file format. Only JPEG, PNG, WEBP, and GIF images are allowed.');
  }

  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds the 5 MB limit.');
  }

  const ext = file.name.split('.').pop() || 'webp';
  const fileName = `projects/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

  const { data, error } = await supabase.storage
    .from('portfolio-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  };
}

/**
 * Delete a project image from Supabase Storage if it belongs to 'portfolio-images'.
 */
export async function deleteProjectImage(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return;
  if (pathOrUrl.includes('assets/images/')) return;

  checkSupabaseConfigured();

  try {
    let storagePath = pathOrUrl;
    if (pathOrUrl.includes('/portfolio-images/')) {
      storagePath = pathOrUrl.split('/portfolio-images/')[1];
    }

    if (storagePath) {
      await supabase.storage
        .from('portfolio-images')
        .remove([storagePath]);
    }
  } catch (err) {
    console.warn('Storage image deletion warning:', err.message);
  }
}


/* ==========================================================================
   SKILLS MANAGEMENT
   ========================================================================== */

/**
 * Fetch ALL skills for Admin Dashboard (includes both visible and hidden skills).
 */
export async function fetchAdminSkills() {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch admin skills: ${error.message}`);
  }
  return data || [];
}

/**
 * Create a new skill record in Supabase.
 */
export async function createSkill(skillData) {
  checkSupabaseConfigured();

  const payload = {
    name: skillData.name,
    category: skillData.category,
    display_order: skillData.display_order ?? skillData.displayOrder ?? 0,
    visible: skillData.visible !== undefined ? Boolean(skillData.visible) : true,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('skills')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create skill: ${error.message}`);
  }
  return data;
}

/**
 * Update an existing skill record in Supabase by ID.
 */
export async function updateSkill(id, skillData) {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('skills')
    .update(skillData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update skill: ${error.message}`);
  }
  return data;
}

/**
 * Delete a skill record from Supabase by ID.
 */
export async function deleteSkill(id) {
  checkSupabaseConfigured();

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete skill: ${error.message}`);
  }
  return { success: true, id };
}

/* ==========================================================================
   EXPERIENCE MANAGEMENT
   ========================================================================== */

/**
 * Fetch ALL experience entries for Admin Dashboard.
 */
export async function fetchAdminExperience() {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch admin experience: ${error.message}`);
  }
  return data || [];
}

/**
 * Create a new experience record in Supabase.
 */
export async function createExperience(expData) {
  checkSupabaseConfigured();

  const payload = {
    company: expData.company,
    position: expData.position,
    location: expData.location || null,
    start_date: expData.start_date || expData.startDate,
    end_date: expData.end_date || expData.endDate || null,
    current: expData.current !== undefined ? Boolean(expData.current) : false,
    description: expData.description || null,
    technologies: Array.isArray(expData.technologies) ? expData.technologies : [],
    display_order: expData.display_order ?? expData.displayOrder ?? 0,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('experience')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create experience: ${error.message}`);
  }
  return data;
}

/**
 * Update an existing experience record in Supabase by ID.
 */
export async function updateExperience(id, expData) {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('experience')
    .update(expData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update experience: ${error.message}`);
  }
  return data;
}

/**
 * Delete an experience record from Supabase by ID.
 */
export async function deleteExperience(id) {
  checkSupabaseConfigured();

  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete experience: ${error.message}`);
  }
  return { success: true, id };
}

/* ==========================================================================
   EDUCATION MANAGEMENT
   ========================================================================== */

/**
 * Fetch ALL education entries for Admin Dashboard.
 */
export async function fetchAdminEducation() {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch admin education: ${error.message}`);
  }
  return data || [];
}

/**
 * Create a new education record in Supabase.
 */
export async function createEducation(eduData) {
  checkSupabaseConfigured();

  const payload = {
    institution: eduData.institution,
    degree: eduData.degree,
    branch: eduData.branch,
    start_date: eduData.start_date || eduData.startDate,
    end_date: eduData.end_date || eduData.endDate,
    description: eduData.description || null,
    display_order: eduData.display_order ?? eduData.displayOrder ?? 0,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('education')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create education: ${error.message}`);
  }
  return data;
}

/**
 * Update an existing education record in Supabase by ID.
 */
export async function updateEducation(id, eduData) {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('education')
    .update(eduData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update education: ${error.message}`);
  }
  return data;
}

/**
 * Delete an education record from Supabase by ID.
 */
export async function deleteEducation(id) {
  checkSupabaseConfigured();

  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete education: ${error.message}`);
  }
  return { success: true, id };
}

/* ==========================================================================
   CERTIFICATIONS MANAGEMENT
   ========================================================================== */

/**
 * Fetch ALL certifications for Admin Dashboard.
 */
export async function fetchAdminCertifications() {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch admin certifications: ${error.message}`);
  }
  return data || [];
}

/**
 * Create a new certification record in Supabase.
 */
export async function createCertification(certData) {
  checkSupabaseConfigured();

  const payload = {
    name: certData.name,
    issuer: certData.issuer,
    issue_date: certData.issue_date || certData.issueDate || certData.date || new Date().toISOString().split('T')[0],
    credential_url: certData.credential_url || certData.credentialUrl || null,
    image_url: certData.image_url || certData.imageUrl || null,
    description: certData.description || null,
    display_order: certData.display_order ?? certData.displayOrder ?? 0,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('certifications')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create certification: ${error.message}`);
  }
  return data;
}

/**
 * Update an existing certification record in Supabase by ID.
 */
export async function updateCertification(id, certData) {
  checkSupabaseConfigured();

  const { data, error } = await supabase
    .from('certifications')
    .update(certData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update certification: ${error.message}`);
  }
  return data;
}

/**
 * Delete a certification record from Supabase by ID.
 */
export async function deleteCertification(id) {
  checkSupabaseConfigured();

  const { error } = await supabase
    .from('certifications')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete certification: ${error.message}`);
  }
  return { success: true, id };
}
