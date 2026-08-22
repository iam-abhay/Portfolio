import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { PROFILE_DATA } from '../../lib/data';

export default function ProfileManager() {
  const [name, setName] = useState(PROFILE_DATA.name);
  const [headline, setHeadline] = useState(PROFILE_DATA.headline);
  const [subtext, setSubtext] = useState(PROFILE_DATA.subtext);
  const [about, setAbout] = useState(PROFILE_DATA.about);
  const [email, setEmail] = useState(PROFILE_DATA.email);
  const [github, setGithub] = useState(PROFILE_DATA.github);
  const [linkedin, setLinkedin] = useState(PROFILE_DATA.linkedin);
  const [resumeUrl, setResumeUrl] = useState(PROFILE_DATA.resumeUrl);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    PROFILE_DATA.name = name;
    PROFILE_DATA.headline = headline;
    PROFILE_DATA.subtext = subtext;
    PROFILE_DATA.about = about;
    PROFILE_DATA.email = email;
    PROFILE_DATA.github = github;
    PROFILE_DATA.linkedin = linkedin;
    PROFILE_DATA.resumeUrl = resumeUrl;
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white">Profile Settings</h2>
        <p className="text-xs text-slate-400">Update your headline, biography, recruiter email, and social links.</p>
      </div>

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

        <div className="pt-4 flex items-center justify-between">
          {saved ? (
            <span className="text-xs text-emerald-400 font-semibold">✓ Profile settings updated!</span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-heading font-semibold text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  );
}
