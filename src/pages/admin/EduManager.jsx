import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GraduationCap, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchAdminEducation, createEducation, updateEducation, deleteEducation } from '../../lib/adminApi';

export default function EduManager() {
  const [education, setEducation] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);

  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadEdu() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchAdminEducation();
        setEducation(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load education entries from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadEdu();
  }, []);

  const resetForm = () => {
    setInstitution('');
    setDegree('');
    setBranch('');
    setStartDate('');
    setEndDate('');
    setEditingEdu(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      institution,
      degree,
      branch,
      start_date: startDate,
      end_date: endDate,
      description: null,
      display_order: education.length + 1,
    };

    try {
      if (editingEdu) {
        const updated = await updateEducation(editingEdu.id, payload);
        setEducation(prev => prev.map(e => (e.id === editingEdu.id ? updated : e)));
        setSuccess('Education entry updated successfully!');
      } else {
        const created = await createEducation(payload);
        setEducation(prev => [created, ...prev]);
        setSuccess('Education entry added successfully!');
      }

      setTimeout(() => setSuccess(''), 3000);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save education entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;

    try {
      setError('');
      setSuccess('');
      await deleteEducation(id);
      setEducation(prev => prev.filter(e => e.id !== id));
      setSuccess('Education entry deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete education entry.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-xs font-mono text-slate-400">Loading Education Records from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Education Management</h2>
          <p className="text-xs text-slate-400">Manage academic degrees and engineering qualifications.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Education
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
          <input
            type="text"
            required
            placeholder="Institution Name (e.g. Smt. Kashibai Navale College of Engineering)"
            value={institution}
            onChange={e => setInstitution(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Degree (e.g. Bachelor of Engineering)"
              value={degree}
              onChange={e => setDegree(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              required
              placeholder="Branch (e.g. Electronics and Telecommunication)"
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Start Date (e.g. 2022-01-01 or 2022)"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              placeholder="End Date (e.g. 2026-06-01 or 2026)"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
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
              <span>{saving ? 'Saving...' : 'Save Education'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {education.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 font-mono text-xs">
            No education entries found in database. Click "Add Education" to create one.
          </div>
        ) : (
          education.map(edu => (
            <div key={edu.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">{edu.degree} in {edu.branch}</h3>
                <p className="text-xs text-sky-400">{edu.institution} • {edu.start_date} - {edu.end_date}</p>
              </div>
              <button onClick={() => handleDelete(edu.id)} className="p-2 text-slate-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
