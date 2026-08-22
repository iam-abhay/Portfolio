import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { INITIAL_EDUCATION } from '../../lib/data';

export default function EduManager() {
  const [education, setEducation] = useState(INITIAL_EDUCATION);
  const [showForm, setShowForm] = useState(false);

  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution,
      degree,
      branch,
      start_date: startDate,
      end_date: endDate,
      description: ''
    };
    setEducation(prev => [newEdu, ...prev]);
    setShowForm(false);
    setInstitution('');
    setDegree('');
    setBranch('');
    setStartDate('');
    setEndDate('');
  };

  const handleDelete = (id) => {
    setEducation(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Education Management</h2>
          <p className="text-xs text-slate-400">Manage academic degrees and engineering qualifications.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

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
              placeholder="Start Date (e.g. 2023)"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              placeholder="End Date (e.g. 2027)"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-sky-600 text-white text-xs rounded-xl font-semibold">
            Save Education
          </button>
        </form>
      )}

      <div className="space-y-4">
        {education.map(edu => (
          <div key={edu.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">{edu.degree} in {edu.branch}</h3>
              <p className="text-xs text-sky-400">{edu.institution} • {edu.start_date} - {edu.end_date}</p>
            </div>
            <button onClick={() => handleDelete(edu.id)} className="p-2 text-slate-500 hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
