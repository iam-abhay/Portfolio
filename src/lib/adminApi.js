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
    syncDatabaseToGit('update profile');
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
    syncDatabaseToGit('create profile');
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
  syncDatabaseToGit('create project');
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
  syncDatabaseToGit('update project');
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
  syncDatabaseToGit('delete project');
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
  syncDatabaseToGit('create skill');
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
  syncDatabaseToGit('update skill');
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
  syncDatabaseToGit('delete skill');
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
  syncDatabaseToGit('create experience');
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
  syncDatabaseToGit('update experience');
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
  syncDatabaseToGit('delete experience');
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
  syncDatabaseToGit('create education');
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
  syncDatabaseToGit('update education');
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
  syncDatabaseToGit('delete education');
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
  syncDatabaseToGit('create certification');
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
  syncDatabaseToGit('update certification');
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
  syncDatabaseToGit('delete certification');
  return { success: true, id };
}

/**
 * Upload a resume PDF file to Supabase Storage.
 */
export async function uploadResumeFile(file) {
  checkSupabaseConfigured();

  if (!file) {
    throw new Error('No file provided for upload.');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Invalid file format. Only PDF files are allowed.');
  }

  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds the 5 MB limit.');
  }

  // Use a predictable name or timestamped name
  const fileName = `resumes/resume-${Date.now()}.pdf`;

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
 * Delete a resume from Supabase Storage.
 */
export async function deleteResumeFile(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return;
  if (pathOrUrl.includes('assets/')) return; // ignore local assets path

  checkSupabaseConfigured();

  let storagePath = pathOrUrl;
  if (pathOrUrl.startsWith('http')) {
    const parts = pathOrUrl.split('/portfolio-images/');
    if (parts.length > 1) {
      storagePath = parts[1];
    } else {
      return; // Not a Supabase Storage path
    }
  }

  const { error } = await supabase.storage
    .from('portfolio-images')
    .remove([storagePath]);

  if (error) {
    console.error(`Failed to delete resume from storage: ${error.message}`);
  }
}

/**
 * Automatically fetch the current database contents from Supabase and sync/commit/push
 * them to the local Git repository (backed up to supabase/db_backup.json).
 * This endpoint is only available when running locally in development.
 */
export async function syncDatabaseToGit(actionName) {
  try {
    if (!supabase) return null;

    // Fetch all tables
    const [
      { data: profile },
      { data: projects },
      { data: skills },
      { data: experience },
      { data: education },
      { data: certifications },
      { data: socialLinks }
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('projects').select('*').order('display_order', { ascending: true }),
      supabase.from('skills').select('*').order('name', { ascending: true }),
      supabase.from('experience').select('*').order('start_date', { ascending: false }),
      supabase.from('education').select('*').order('start_date', { ascending: false }),
      supabase.from('certifications').select('*').order('name', { ascending: true }),
      supabase.from('social_links').select('*')
    ]);

    const backup = {
      timestamp: new Date().toISOString(),
      profile: (profile && profile.length > 0) ? profile[0] : null,
      projects: projects || [],
      skills: skills || [],
      experience: experience || [],
      education: education || [],
      certifications: certifications || [],
      social_links: socialLinks || []
    };

    const response = await fetch('/api/admin/git-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `admin: ${actionName}`,
        backup
      })
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (err) {
    console.warn('Git sync failed (expected in production or if server is stopped):', err);
    return null;
  }
}

/**
 * Upload a profile image file to Supabase Storage.
 */
export async function uploadProfileImageFile(file) {
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
  const fileName = `profile/profile-${Date.now()}.${ext}`;

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

