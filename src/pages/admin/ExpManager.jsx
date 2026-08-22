import React, { useState } from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { INITIAL_EXPERIENCE } from '../../lib/data';

export default function ExpManager() {
  const [experiences, setExperiences] = useState(INITIAL_EXPERIENCE);
  const [showForm, setShowForm] = useState(false);

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExp = {
      id: `exp-${Date.now()}`,
      company,
      position,
      location,
      start_date: startDate,
      end_date: endDate || 'Present',
      current: !endDate,
      description,
      technologies: []
    };
    setExperiences(prev => [newExp, ...prev]);
    setShowForm(false);
    setCompany('');
    setPosition('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setDescription('');
  };

  const handleDelete = (id) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Experience Management</h2>
          <p className="text-xs text-slate-400">Manage work history and developer experience entries.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Company / Organization"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              required
              placeholder="Position Title (e.g. Java Backend Intern)"
              value={position}
              onChange={e => setPosition(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Location (e.g. Pune, India)"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              placeholder="Start Date (e.g. 2024)"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <input
              type="text"
              placeholder="End Date (e.g. Present)"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
          <textarea
            rows={3}
            placeholder="Responsibilities and technologies used..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
          <button type="submit" className="px-4 py-2 bg-sky-600 text-white text-xs rounded-xl font-semibold">
            Save Entry
          </button>
        </form>
      )}

      <div className="space-y-4">
        {experiences.map(exp => (
          <div key={exp.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">{exp.position}</h3>
              <p className="text-xs text-sky-400">{exp.company} • {exp.start_date} - {exp.end_date}</p>
              <p className="text-xs text-slate-400">{exp.description}</p>
            </div>
            <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-500 hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
