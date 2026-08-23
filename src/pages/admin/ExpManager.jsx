import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Briefcase, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchAdminExperience, createExperience, updateExperience, deleteExperience } from '../../lib/adminApi';

export default function ExpManager() {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadExp() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchAdminExperience();
        setExperiences(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load experience records from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadExp();
  }, []);

  const resetForm = () => {
    setCompany('');
    setPosition('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setEditingExp(null);
    setShowForm(false);
  };

  const handleEdit = (exp) => {
    setEditingExp(exp);
    setCompany(exp.company || '');
    setPosition(exp.position || '');
    setLocation(exp.location || '');
    setStartDate(exp.start_date || exp.startDate || '');
    setEndDate(exp.end_date || exp.endDate || '');
    setDescription(exp.description || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      company,
      position,
      location: location || null,
      start_date: startDate,
      end_date: endDate || null,
      current: !endDate || endDate.toLowerCase() === 'present',
      description: description || null,
      technologies: editingExp ? editingExp.technologies : [],
      display_order: editingExp ? editingExp.display_order : experiences.length + 1,
    };

    try {
      if (editingExp) {
        const updated = await updateExperience(editingExp.id, payload);
        setExperiences(prev => prev.map(e => (e.id === editingExp.id ? updated : e)));
        setSuccess('Experience entry updated successfully!');
      } else {
        const created = await createExperience(payload);
        setExperiences(prev => [created, ...prev]);
        setSuccess('Experience entry added successfully!');
      }

      setTimeout(() => setSuccess(''), 3000);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save experience entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience record?')) return;

    try {
      setError('');
      setSuccess('');
      await deleteExperience(id);
      setExperiences(prev => prev.filter(e => e.id !== id));
      setSuccess('Experience entry deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete experience entry.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-xs font-mono text-slate-400">Loading Experience Entries from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Experience Management</h2>
          <p className="text-xs text-slate-400">Manage work history and developer experience entries.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Experience
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

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Company / Organization"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
            <input
              type="text"
              required
              placeholder="Position Title (e.g. Java Backend Intern)"
              value={position}
              onChange={e => setPosition(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Location (e.g. Pune, India)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
            <input
              type="text"
              placeholder="Start Date (e.g. 2024-01-01 or Jan 2024)"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
            <input
              type="text"
              placeholder="End Date (e.g. Present)"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
          </div>
          <textarea
            rows={3}
            placeholder="Responsibilities and technologies used..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500 resize-none"
          />
          <div className="flex justify-end gap-3 pt-2">
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
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{saving ? 'Saving...' : editingExp ? 'Update Entry' : 'Save Entry'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 font-mono text-xs">
            No experience entries found in database. Click "Add Experience" to create one.
          </div>
        ) : (
          experiences.map(exp => (
            <div key={exp.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">{exp.position}</h3>
                <p className="text-xs text-sky-400">{exp.company} • {exp.start_date} - {exp.end_date || 'Present'}</p>
                <p className="text-xs text-slate-400">{exp.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(exp)} className="p-2 text-slate-500 hover:text-sky-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
