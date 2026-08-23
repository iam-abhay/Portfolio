import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, Check, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchAdminProjects, createProject, updateProject, deleteProject } from '../../lib/adminApi';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // UI status states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  // Load all admin projects on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchAdminProjects();
        setProjects(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load projects from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory('Software Engineering');
    setShortDesc('');
    setDescription('');
    setTechnologies('');
    setGithubUrl('');
    setLiveUrl('');
    setImageUrl('');
    setFeatured(false);
    setPublished(true);
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (proj) => {
    setEditingProject(proj);
    setTitle(proj.title || '');
    setCategory(proj.category || 'Software Engineering');
    setShortDesc(proj.short_description || proj.shortDesc || '');
    setDescription(proj.description || '');
    setTechnologies(Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '');
    setGithubUrl(proj.github_url || proj.githubUrl || '');
    setLiveUrl(proj.live_url || proj.liveUrl || '');
    setImageUrl(proj.image_url || proj.imageUrl || '');
    setFeatured(Boolean(proj.featured));
    setPublished(Boolean(proj.published));
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setSuccess('Project deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete project.');
    }
  };

  const handleTogglePublish = async (id) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;

    try {
      setError('');
      setSuccess('');
      const updated = await updateProject(id, { published: !target.published });
      setProjects(prev => prev.map(p => (p.id === id ? updated : p)));
      setSuccess(`Project ${updated.published ? 'published' : 'unpublished'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to toggle publication status.');
    }
  };

  const handleToggleFeatured = async (id) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;

    try {
      setError('');
      setSuccess('');
      const updated = await updateProject(id, { featured: !target.featured });
      setProjects(prev => prev.map(p => (p.id === id ? updated : p)));
      setSuccess(`Project ${updated.featured ? 'marked as featured' : 'unfeatured'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to toggle featured status.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const techArray = technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      category,
      short_description: shortDesc,
      description,
      technologies: techArray,
      github_url: githubUrl,
      live_url: liveUrl,
      image_url: imageUrl || 'assets/images/project-ai-analytics.jpg',
      featured,
      published,
    };

    try {
      if (editingProject) {
        const updated = await updateProject(editingProject.id, payload);
        setProjects(prev => prev.map(p => (p.id === editingProject.id ? updated : p)));
        setSuccess('Project updated successfully!');
      } else {
        const created = await createProject(payload);
        setProjects(prev => [created, ...prev]);
        setSuccess('Project created successfully!');
      }

      setTimeout(() => setSuccess(''), 3000);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-xs font-mono text-slate-400">Loading Projects from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">
            Project Management
          </h2>
          <p className="text-xs text-slate-400">
            Add, update, publish, or remove projects shown on your live portfolio.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-heading font-semibold flex items-center gap-2 self-start transition-colors shadow-md shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
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

      {/* Add / Edit Form Modal Drawer */}
      {showForm && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-base">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. AgriEase — AI Smart Agriculture"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="AI / ML">AI / ML</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">Short Description</label>
              <input
                type="text"
                required
                value={shortDesc}
                onChange={e => setShortDesc(e.target.value)}
                placeholder="Brief summary for project card..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">Full Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detailed explanation of architecture & functionality..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={technologies}
                  onChange={e => setTechnologies(e.target.value)}
                  placeholder="Java, Spring Boot, React"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">GitHub URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/iam-abhay/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Live Demo URL</label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={e => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={e => setPublished(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-sky-600 focus:ring-0"
                />
                Published Status
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-sky-600 focus:ring-0"
                />
                Mark as Featured
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{saving ? 'Saving...' : 'Save Project'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Table List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-heading uppercase text-[11px]">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-mono">
                    No projects found in database. Click "Add Project" to create one.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      {proj.title}
                      {proj.featured && (
                        <button
                          onClick={() => handleToggleFeatured(proj.id)}
                          className="ml-2 inline-flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
                          title="Click to unfeature"
                        >
                          <Sparkles className="w-3 h-3" /> Featured
                        </button>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">{proj.category}</td>
                    <td className="p-4">
                      {proj.published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <Eye className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <EyeOff className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleTogglePublish(proj.id)}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                        title={proj.published ? 'Unpublish' : 'Publish'}
                      >
                        {proj.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleEdit(proj)}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-sky-400"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-red-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
