import React, { useState, useEffect } from 'react';
import { User, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchAdminProfile, updateProfile } from '../../lib/adminApi';

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
          setProfileImageUrl(data.profile_image_url || data.profileImageUrl || '');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile data from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
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
        resumeUrl,
        profileImageUrl,
      };

      const updated = await updateProfile(payload);
      if (updated && updated.id) {
        setProfileId(updated.id);
      }
      setSuccess('Profile settings successfully saved to Supabase!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save profile settings.');
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

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
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
            <label className="text-xs text-slate-300">Resume Link / Static URL</label>
            <input
              type="text"
              value={resumeUrl}
              onChange={e => setResumeUrl(e.target.value)}
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
            <span>{saving ? 'Saving...' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
