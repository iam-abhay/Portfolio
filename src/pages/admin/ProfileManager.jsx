import React, { useState, useEffect } from 'react';
import { User, Save, Loader2, AlertCircle, CheckCircle2, FileText, Upload, Trash2 } from 'lucide-react';
import { fetchAdminProfile, updateProfile, uploadResumeFile, deleteResumeFile, uploadProfileImageFile } from '../../lib/adminApi';

const getResumeUrl = (url) => {
  if (!url || url === '#') {
    return `${import.meta.env.BASE_URL}assets/resume.pdf`;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  return `${import.meta.env.BASE_URL}${cleanUrl}`;
};

const getProfileImageUrl = (url) => {
  if (!url) {
    return `${import.meta.env.BASE_URL}assets/images/profile.jpg`;
  }
  if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  return `${import.meta.env.BASE_URL}${cleanUrl}`;
};

export default function ProfileManager() {
  const [profileId, setProfileId] = useState(null);
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [about, setAbout] = useState('');
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [uploadNotice, setUploadNotice] = useState('');
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState(null);
  const [profileImageNotice, setProfileImageNotice] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [gitSyncStatus, setGitSyncStatus] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchAdminProfile();
        if (data) {
          setProfileId(data.id || null);
          setName(data.name || '');
          setHeadline(data.headline || '');
          setSubtext(data.short_bio || data.subtext || '');
          setAbout(data.about || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setGithub(data.github_url || data.github || '');
          setLinkedin(data.linkedin_url || data.linkedin || '');
          setResumeUrl(data.resume_url || data.resumeUrl || '');
          const imgUrl = data.profile_image_url || data.profileImageUrl || '';
          setProfileImageUrl(imgUrl);
          setProfileImagePreview(imgUrl);
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile data from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Invalid file format. Only PDF files are allowed.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      setError('File size exceeds the 5 MB limit.');
      return;
    }

    setSelectedResumeFile(file);
    setUploadNotice(`File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB). Will upload on save.`);
    setError('');
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file format. Only JPEG, PNG, WEBP, and GIF images are allowed.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      setError('File size exceeds the 5 MB limit.');
      return;
    }

    setSelectedProfileImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
    setProfileImageNotice(`Photo selected: ${file.name}. Will upload on save.`);
    setError('');
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete the resume? This will delete the local file, remove it from git repository, and delete the Supabase Storage backup.')) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    setGitSyncStatus('Deleting resume from Git repository...');

    try {
      // 1. Delete local file (updates local repo)
      try {
        await fetch('/api/admin/resume', {
          method: 'DELETE'
        });
      } catch (localErr) {
        console.warn('Failed to delete resume locally:', localErr);
      }

      // 2. Delete Supabase Storage file
      if (resumeUrl && !resumeUrl.includes('assets/')) {
        await deleteResumeFile(resumeUrl);
      }

      // 3. Update database
      const payload = {
        id: profileId,
        name,
        headline,
        subtext,
        about,
        email,
        phone,
        github,
        linkedin,
        resumeUrl: '#', // Default fallback
        profileImageUrl,
      };

      const updated = await updateProfile(payload);
      if (updated && updated.id) {
        setProfileId(updated.id);
      }

      setResumeUrl('#');
      setSelectedResumeFile(null);
      setUploadNotice('');
      setSuccess('Resume successfully deleted and Git changes pushed!');
      setGitSyncStatus('Resume successfully deleted and Git changes pushed!');
      setTimeout(() => {
        setSuccess('');
        setGitSyncStatus('');
      }, 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete resume.');
      setGitSyncStatus('');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    setGitSyncStatus('');

    try {
      let finalResumeUrl = resumeUrl;
      let finalProfileImageUrl = profileImageUrl;

      // 1. Upload Resume PDF
      if (selectedResumeFile) {
        setGitSyncStatus('Uploading PDF and syncing with Git repository...');

        // Upload to Supabase Storage (fallback)
        let storagePublicUrl = '';
        try {
          const uploadRes = await uploadResumeFile(selectedResumeFile);
          storagePublicUrl = uploadRes.publicUrl;
        } catch (uploadErr) {
          console.error('Supabase storage upload failed:', uploadErr);
        }

        // Upload to local Vite server (primary)
        try {
          const response = await fetch('/api/admin/resume', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/pdf',
            },
            body: selectedResumeFile,
          });

          if (response.ok) {
            const resData = await response.json();
            console.log('Local resume upload success:', resData);
            finalResumeUrl = 'assets/resume.pdf';
          } else {
            console.warn('Local endpoint not available. Using Supabase public URL.');
            finalResumeUrl = storagePublicUrl || resumeUrl;
          }
        } catch (localErr) {
          console.warn('Failed to upload to local dev server:', localErr);
          finalResumeUrl = storagePublicUrl || resumeUrl;
        }
      }

      // 2. Upload Profile Image Photo
      if (selectedProfileImageFile) {
        setGitSyncStatus('Uploading profile image and syncing with Git...');

        // Upload to Supabase Storage (fallback)
        let storageImgUrl = '';
        try {
          const uploadRes = await uploadProfileImageFile(selectedProfileImageFile);
          storageImgUrl = uploadRes.publicUrl;
        } catch (uploadErr) {
          console.error('Supabase image upload failed:', uploadErr);
        }

        // Upload to local Vite server (primary)
        try {
          const response = await fetch('/api/admin/profile-image', {
            method: 'POST',
            headers: {
              'Content-Type': selectedProfileImageFile.type,
            },
            body: selectedProfileImageFile,
          });

          if (response.ok) {
            const resData = await response.json();
            console.log('Local image upload success:', resData);
            finalProfileImageUrl = 'assets/images/profile.jpg';
          } else {
            console.warn('Local endpoint not available. Using Supabase public URL.');
            finalProfileImageUrl = storageImgUrl || profileImageUrl;
          }
        } catch (localErr) {
          console.warn('Failed to upload to local dev server:', localErr);
          finalProfileImageUrl = storageImgUrl || profileImageUrl;
        }
      }

      const payload = {
        id: profileId,
        name,
        headline,
        subtext,
        about,
        email,
        phone,
        github,
        linkedin,
        resumeUrl: finalResumeUrl,
        profileImageUrl: finalProfileImageUrl,
      };

      const updated = await updateProfile(payload);
      if (updated && updated.id) {
        setProfileId(updated.id);
        setResumeUrl(finalResumeUrl);
        setProfileImageUrl(finalProfileImageUrl);
        setProfileImagePreview(finalProfileImageUrl);
      }
      
      setSelectedResumeFile(null);
      setUploadNotice('');
      setSelectedProfileImageFile(null);
      setProfileImageNotice('');
      setSuccess('Profile settings successfully saved!');
      setTimeout(() => {
        setSuccess('');
        setGitSyncStatus('');
      }, 4000);
    } catch (err) {
      setError(err.message || 'Failed to save profile settings.');
      setGitSyncStatus('');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-xs font-mono text-slate-400">Loading Profile Settings from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white">Profile Settings</h2>
        <p className="text-xs text-slate-400">Update your headline, biography, recruiter email, and social links.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {gitSyncStatus && !success && (
        <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium flex items-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          <span>{gitSyncStatus}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        
        {/* Profile Avatar Upload / Preview Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <div className="relative group shrink-0">
            {profileImagePreview ? (
              <img
                src={getProfileImageUrl(profileImagePreview)}
                alt="Profile Preview"
                className="w-24 h-24 rounded-2xl object-cover border border-slate-700 shadow-md group-hover:scale-[1.02] transition-transform"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 font-mono text-[10px]">
                No Photo
              </div>
            )}
            <label className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-[10px] text-white font-medium">
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-200">Profile Photo</h4>
            <p className="text-[11px] text-slate-400">
              Upload a professional square picture (max 5 MB). Supported formats: JPEG, PNG, WEBP, GIF.
            </p>
            {profileImageNotice && (
              <div className="text-[10px] text-sky-400 font-mono bg-sky-950/20 border border-sky-900/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 inline-block">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                <span>{profileImageNotice}</span>
              </div>
            )}
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 font-mono break-all">
                {profileImageUrl ? `Current Path: ${profileImageUrl}` : 'No image path configured'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Primary Headline Positioning</label>
          <input
            type="text"
            required
            value={headline}
            onChange={e => setHeadline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Secondary Positioning / Intro Subtext</label>
          <input
            type="text"
            required
            value={subtext}
            onChange={e => setSubtext(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">About Me Professional Summary</label>
          <textarea
            rows={5}
            required
            value={about}
            onChange={e => setAbout(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Recruiter Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Contact Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Resume PDF Management Section */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Resume PDF Document</label>
            {resumeUrl && resumeUrl !== '#' && (
              <button
                type="button"
                onClick={handleDeleteResume}
                className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Current Resume</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              {resumeUrl && resumeUrl !== '#' ? (
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-2 truncate font-mono">
                  <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="truncate">
                    {resumeUrl.includes('assets/') ? 'Local PDF (public/assets/resume.pdf)' : `External Link: ${resumeUrl}`}
                  </span>
                </div>
              ) : (
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-dashed border-slate-700 text-xs text-slate-500 flex items-center gap-2 font-mono">
                  <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>No Resume PDF uploaded</span>
                </div>
              )}
            </div>

            <label className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload PDF</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {uploadNotice && (
            <div className="text-[11px] text-sky-400 bg-sky-950/20 border border-sky-900/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 animate-pulse" />
              <span>{uploadNotice}</span>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-medium">Or Use Custom Resume URL</span>
            <input
              type="text"
              value={resumeUrl === '#' ? '' : resumeUrl}
              onChange={e => {
                setResumeUrl(e.target.value || '#');
                if (selectedResumeFile) {
                  setSelectedResumeFile(null);
                  setUploadNotice('');
                }
              }}
              placeholder="https://... (Optional fallback URL)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">GitHub Profile URL</label>
            <input
              type="url"
              value={github}
              onChange={e => setGithub(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">LinkedIn Profile URL</label>
            <input
              type="url"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-heading font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-sky-600/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving & Syncing...' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
