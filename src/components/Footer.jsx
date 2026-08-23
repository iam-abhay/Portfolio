import React from 'react';
import { Github, Linkedin, ArrowUp } from 'lucide-react';

const getProfileImageUrl = (url) => {
  if (!url) {
    return `${import.meta.env.BASE_URL}assets/images/profile.jpg`;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  return `${import.meta.env.BASE_URL}${cleanUrl}`;
};

export default function Footer({ profile }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 shrink-0">
              <img
                src={getProfileImageUrl(profile?.profileImageUrl)}
                alt="Abhay Kharat Profile"
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-md"
                id="footer-avatar-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.getElementById('footer-initials-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                id="footer-initials-fallback"
                style={{ display: 'none' }}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md"
              >
                AK
              </div>
            </div>
            <div>
              <span className="font-heading font-bold text-slate-900 dark:text-white text-base block">
                {profile.name || "Abhay Dilip Kharat"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Software Engineer | Java Backend / Full-Stack
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors border border-slate-200 dark:border-slate-800"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors border border-slate-200 dark:border-slate-800"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors border border-slate-200 dark:border-slate-800"
              title="Scroll Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <p>&copy; {new Date().getFullYear()} Abhay Dilip Kharat. All rights reserved.</p>
          <p className="font-mono">Built with React, Vite, Tailwind CSS & Supabase.</p>
        </div>

      </div>
    </footer>
  );
}
