import React, { useState } from 'react';
import { Plus, Trash2, Cpu } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../lib/data';

export default function SkillManager() {
  const [categories, setCategories] = useState(SKILL_CATEGORIES);
  const [newSkillName, setNewSkillName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState(SKILL_CATEGORIES[0]?.id || 'languages');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === selectedCatId) {
          return { ...cat, skills: [...cat.skills, newSkillName.trim()] };
        }
        return cat;
      })
    );
    setNewSkillName('');
  };

  const handleDeleteSkill = (catId, skillName) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === catId) {
          return { ...cat, skills: cat.skills.filter(s => s !== skillName) };
        }
        return cat;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white">
          Skills Matrix Management
        </h2>
        <p className="text-xs text-slate-400">
          Manage technical skill tags organized by domain categories.
        </p>
      </div>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-xs text-slate-300">Category</label>
          <select
            value={selectedCatId}
            onChange={e => setSelectedCatId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-1 w-full">
          <label className="text-xs text-slate-300">New Skill Name</label>
          <input
            type="text"
            required
            value={newSkillName}
            onChange={e => setNewSkillName(e.target.value)}
            placeholder="e.g. Apache Spark, Kafka, FastAPI"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-heading font-semibold flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </form>

      {/* Skill Categories Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <h3 className="font-heading font-bold text-white text-base">{cat.name}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono flex items-center gap-2 border border-slate-700"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleDeleteSkill(cat.id, skill)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
