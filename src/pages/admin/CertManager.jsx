import React, { useState } from 'react';
import { Plus, Trash2, Award } from 'lucide-react';
import { INITIAL_CERTIFICATIONS } from '../../lib/data';

export default function CertManager() {
  const [certs, setCerts] = useState(INITIAL_CERTIFICATIONS);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCert = {
      id: `cert-${Date.now()}`,
      name,
      issuer,
      date,
      credential_url: url || '#'
    };
    setCerts(prev => [newCert, ...prev]);
    setShowForm(false);
    setName('');
    setIssuer('');
    setDate('');
    setUrl('');
  };

  const handleDelete = (id) => {
    setCerts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Certification Management</h2>
          <p className="text-xs text-slate-400">Manage verified technical certificates and developer training.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <input
            type="text"
            required
            placeholder="Certificate Name (e.g. Java Backend Development)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Issuing Organization"
              value={issuer}
              onChange={e => setIssuer(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              placeholder="Date Issued (e.g. 2025)"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
          <input
            type="url"
            placeholder="Credential URL (optional)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
          <button type="submit" className="px-4 py-2 bg-sky-600 text-white text-xs rounded-xl font-semibold">
            Save Certification
          </button>
        </form>
      )}

      <div className="space-y-4">
        {certs.map(cert => (
          <div key={cert.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">{cert.name}</h3>
              <p className="text-xs text-sky-400">{cert.issuer} • {cert.date}</p>
            </div>
            <button onClick={() => handleDelete(cert.id)} className="p-2 text-slate-500 hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
