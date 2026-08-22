import React from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Cpu, Briefcase, Award, Plus, CheckCircle2 } from 'lucide-react';
import { INITIAL_PROJECTS, SKILL_CATEGORIES, INITIAL_EXPERIENCE, INITIAL_CERTIFICATIONS } from '../../lib/data';

export default function AdminDashboard() {
  const stats = [
    { label: 'Published Projects', count: INITIAL_PROJECTS.length, icon: FolderGit2, color: 'text-sky-400', path: '/admin/projects' },
    { label: 'Skill Categories', count: SKILL_CATEGORIES.length, icon: Cpu, color: 'text-indigo-400', path: '/admin/skills' },
    { label: 'Experience Entries', count: INITIAL_EXPERIENCE.length, icon: Briefcase, color: 'text-emerald-400', path: '/admin/experience' },
    { label: 'Certifications', count: INITIAL_CERTIFICATIONS.length, icon: Award, color: 'text-amber-400', path: '/admin/certifications' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white">
          Dashboard Overview
        </h2>
        <p className="text-xs text-slate-400">
          Manage your live portfolio content, projects, skills matrix, and profile settings.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.path}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-heading font-extrabold text-white group-hover:text-sky-400 transition-colors">
                  {stat.count}
                </span>
              </div>
              <span className="text-xs font-heading font-semibold text-slate-400 block">
                {stat.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Quick Action & Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-heading font-bold text-white text-base">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/projects"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-heading font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Project
            </Link>
            <Link
              to="/admin/skills"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-heading font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Skill
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-heading font-bold text-white text-base">
            System Status
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Public Portfolio: <strong>Active & Responsive</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Supabase / Fallback Store: <strong>Synced</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
