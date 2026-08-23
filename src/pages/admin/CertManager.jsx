import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Award, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchAdminCertifications, createCertification, updateCertification, deleteCertification } from '../../lib/adminApi';

export default function CertManager() {
  const [certs, setCerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCert, setEditingCert] = useState(null);

  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [url, setUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadCerts() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchAdminCertifications();
        setCerts(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load certifications from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadCerts();
  }, []);

  const resetForm = () => {
    setName('');
    setIssuer('');
    setDate('');
    setUrl('');
    setEditingCert(null);
    setShowForm(false);
  };

  const handleEdit = (cert) => {
    setEditingCert(cert);
    setName(cert.name || '');
    setIssuer(cert.issuer || '');
    setDate(cert.issue_date || cert.date || '');
    setUrl(cert.credential_url || cert.url || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      name,
      issuer,
      issue_date: date || new Date().toISOString().split('T')[0],
      credential_url: url || '#',
      display_order: editingCert ? editingCert.display_order : certs.length + 1,
    };

    try {
      if (editingCert) {
        const updated = await updateCertification(editingCert.id, payload);
        setCerts(prev => prev.map(c => (c.id === editingCert.id ? updated : c)));
        setSuccess('Certification updated successfully!');
      } else {
        const created = await createCertification(payload);
        setCerts(prev => [created, ...prev]);
        setSuccess('Certification added successfully!');
      }

      setTimeout(() => setSuccess(''), 3000);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save certification.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;

    try {
      setError('');
      setSuccess('');
      await deleteCertification(id);
      setCerts(prev => prev.filter(c => c.id !== id));
      setSuccess('Certification deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete certification.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-xs font-mono text-slate-400">Loading Certifications from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Certification Management</h2>
          <p className="text-xs text-slate-400">Manage verified technical certificates and developer training.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Certification
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
            placeholder="Certificate Name (e.g. Java Backend Development)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Issuing Organization"
              value={issuer}
              onChange={e => setIssuer(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
            <input
              type="text"
              placeholder="Date Issued (e.g. 2025-01-01 or 2025)"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
            />
          </div>
          <input
            type="url"
            placeholder="Credential URL (optional)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
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
              <span>{saving ? 'Saving...' : editingCert ? 'Update Certification' : 'Save Certification'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {certs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 font-mono text-xs">
            No certification entries found in database. Click "Add Certification" to create one.
          </div>
        ) : (
          certs.map(cert => (
            <div key={cert.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">{cert.name}</h3>
                <p className="text-xs text-sky-400">{cert.issuer} • {cert.issue_date || cert.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(cert)} className="p-2 text-slate-500 hover:text-sky-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cert.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
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
