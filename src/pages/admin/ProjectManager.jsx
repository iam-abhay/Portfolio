import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, Check, X, Loader2, AlertCircle, CheckCircle2, Upload, Image as ImageIcon, ImageOff, Github, ExternalLink } from 'lucide-react';
import { fetchAdminProjects, createProject, updateProject, deleteProject, uploadProjectImage, deleteProjectImage } from '../../lib/adminApi';
import { getResolvedImageUrl } from '../../components/ProjectCard';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [uploadNotice, setUploadNotice] = useState('');
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
    setSelectedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview('');
    setUploadNotice('');
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
    setSelectedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview('');
    setUploadNotice('');
    setFeatured(Boolean(proj.featured));
    setPublished(Boolean(proj.published));
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file format. Only JPEG, PNG, WEBP, and GIF images are allowed.');
      setUploadNotice('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5 MB limit.');
      setUploadNotice('');
      return;
    }

    setError('');
    setSelectedFile(file);
    setImageUrl(''); // Clear text URL when device file is chosen
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(URL.createObjectURL(file));
    setUploadNotice(`File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB). Will upload on save.`);
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setSelectedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview('');
    setUploadNotice('');
  };

  const handleDelete = async (id) => {
    const target = projects.find(p => p.id === id);
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await deleteProject(id);

      if (target?.image_url) {
        await deleteProjectImage(target.image_url);
      }

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

    try {
      let finalImageUrl = imageUrl ? imageUrl.trim() : null;

      // Method 1: If a device file is selected, upload it to Supabase Storage
      if (selectedFile) {
        try {
          const uploadRes = await uploadProjectImage(selectedFile);
          if (!uploadRes || !uploadRes.publicUrl) {
            throw new Error('Supabase Storage did not return a valid public URL.');
          }
          finalImageUrl = uploadRes.publicUrl;
        } catch (uploadErr) {
          throw new Error(`Image upload failed: ${uploadErr.message}`);
        }
      } else if (finalImageUrl) {
        // Method 2: External HTTPS URL validation
        if (
          !finalImageUrl.startsWith('https://') &&
          !finalImageUrl.startsWith('assets/') &&
          !finalImageUrl.startsWith('/')
        ) {
          if (finalImageUrl.startsWith('http://')) {
            throw new Error('Insecure HTTP image URL rejected. Please use a secure https:// image URL.');
          }
          if (
            finalImageUrl.startsWith('javascript:') ||
            finalImageUrl.startsWith('data:') ||
            finalImageUrl.startsWith('file:')
          ) {
            throw new Error('Invalid image URL format.');
          }
        }
      }

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
        image_url: finalImageUrl,
        featured,
        published,
      };

      if (editingProject) {
        const updated = await updateProject(editingProject.id, payload);

        // Delete old storage image if it was replaced by a new upload
        if (selectedFile && editingProject.image_url && editingProject.image_url !== finalImageUrl) {
          await deleteProjectImage(editingProject.image_url);
        }

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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-xs font-mono">Loading projects from Supabase database...</p>
      </div>
    );
  }

  const activeDisplayImage = filePreview || getResolvedImageUrl(imageUrl);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
            <span>Project Manager</span>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-mono">
              {projects.length} Total
            </span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Create, edit, feature, and manage portfolio project showcases.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-sky-600/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {/* Success / Error Banners */}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Create / Edit Drawer Form */}
      {showForm && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-heading font-bold text-white">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. AgriEase – AI Agriculture Platform"
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
                  <option value="Full Stack">Full Stack</option>
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
                  type="text"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/iam-abhay/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Live Demo URL</label>
                <input
                  type="text"
                  value={liveUrl}
                  onChange={e => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Project Image Management Section (Dual Method: Device Upload OR External URL) */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-sky-400" />
                  <span>Project Image</span>
                  <span className="text-[11px] text-slate-400 font-normal">(Optional)</span>
                </label>
                {(activeDisplayImage || selectedFile) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
                  >
                    <ImageOff className="w-3.5 h-3.5" /> Remove Image
                  </button>
                )}
              </div>

              {/* Status Notice */}
              {uploadNotice && (
                <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadNotice}</span>
                </div>
              )}

              {/* Image Preview Window */}
              {activeDisplayImage ? (
                <div className="relative h-40 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                  <img
                    src={activeDisplayImage}
                    alt="Project Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-slate-900/80 text-[10px] font-mono text-slate-300 backdrop-blur border border-slate-700/50">
                    {selectedFile ? `Device Image Selected: ${selectedFile.name}` : 'Current Image Preview'}
                  </div>
                </div>
              ) : (
                <div className="h-24 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center text-slate-500 space-y-1">
                  <ImageIcon className="w-6 h-6 text-slate-600" />
                  <span className="text-xs">No image assigned (Default fallback will display)</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Method 1: Device File Upload */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Method 1: Upload from Device</span>
                  <label className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                    selectedFile
                      ? 'bg-sky-950/60 border-sky-500 text-sky-300'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                  }`}>
                    <Upload className="w-3.5 h-3.5 text-sky-400" />
                    <span className="truncate">{selectedFile ? selectedFile.name : 'Choose File from Computer'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Method 2: External HTTPS Image URL */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Method 2: Or External HTTPS URL</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={e => {
                      setImageUrl(e.target.value);
                      if (selectedFile) {
                        setSelectedFile(null);
                        if (filePreview) URL.revokeObjectURL(filePreview);
                        setFilePreview('');
                        setUploadNotice('');
                      }
                    }}
                    placeholder="https://... (Optional if device file chosen)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
                  />
                </div>
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
                <span>{saving ? 'Uploading & Saving...' : 'Save Project'}</span>
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
                      <div className="flex items-center gap-3">
                        {proj.image_url ? (
                          <img
                            src={getResolvedImageUrl(proj.image_url)}
                            alt=""
                            className="w-10 h-8 object-cover rounded-md bg-slate-950 shrink-0 border border-slate-700/60"
                          />
                        ) : (
                          <div className="w-10 h-8 rounded-md bg-slate-800 shrink-0 flex items-center justify-center text-slate-500">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="font-semibold text-white">{proj.title}</div>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                            {proj.github_url ? (
                              <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 flex items-center gap-1 transition-colors">
                                <Github className="w-3 h-3 text-slate-500" /> Repo
                              </a>
                            ) : (
                              <span className="text-slate-600">No Repo</span>
                            )}
                            {proj.live_url && proj.live_url !== '#' ? (
                              <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 flex items-center gap-1 transition-colors">
                                <ExternalLink className="w-3 h-3 text-slate-500" /> Live Demo
                              </a>
                            ) : (
                              <span className="text-slate-600">No Demo</span>
                            )}
                          </div>
                          {proj.featured && (
                            <button
                              onClick={() => handleToggleFeatured(proj.id)}
                              className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
                              title="Click to unfeature"
                            >
                              <Sparkles className="w-3 h-3" /> Featured
                            </button>
                          )}
                        </div>
                      </div>
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
