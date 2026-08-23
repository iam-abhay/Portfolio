import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Cpu, Briefcase, Award, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchAdminProjects, fetchAdminSkills, fetchAdminExperience, fetchAdminCertifications } from '../../lib/adminApi';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    certifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        setError('');
        const [projects, skills, experience, certifications] = await Promise.all([
          fetchAdminProjects(),
          fetchAdminSkills(),
          fetchAdminExperience(),
          fetchAdminCertifications(),
        ]);

        setCounts({
          projects: projects?.length || 0,
          skills: skills?.length || 0,
          experience: experience?.length || 0,
          certifications: certifications?.length || 0,
        });
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const stats = [
    { label: 'Projects Count', count: counts.projects, icon: FolderGit2, color: 'text-sky-400', path: '/admin/projects' },
    { label: 'Skills Registered', count: counts.skills, icon: Cpu, color: 'text-indigo-400', path: '/admin/skills' },
    { label: 'Experience Entries', count: counts.experience, icon: Briefcase, color: 'text-emerald-400', path: '/admin/experience' },
    { label: 'Certifications', count: counts.certifications, icon: Award, color: 'text-amber-400', path: '/admin/certifications' },
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

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

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
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : stat.count}
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
              <span>Supabase Live Store: <strong>Synced & Authenticated</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
