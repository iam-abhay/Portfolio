import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Cpu, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchAdminSkills, createSkill, deleteSkill } from '../../lib/adminApi';

const CATEGORY_NAMES = [
  'Programming Languages',
  'Backend Development',
  'Frontend Development',
  'Database',
  'Cloud & DevOps',
  'Tools & IDEs',
  'AI-Assisted Development',
  'Core CS Concepts'
];

export default function SkillManager() {
  const [skillsList, setSkillsList] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [selectedCatName, setSelectedCatName] = useState(CATEGORY_NAMES[0]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchAdminSkills();
        setSkillsList(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load skills from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const created = await createSkill({
        name: newSkillName.trim(),
        category: selectedCatName,
        display_order: skillsList.length + 1,
        visible: true,
      });

      setSkillsList(prev => [...prev, created]);
      setNewSkillName('');
      setSuccess('Skill added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id, skillName) => {
    if (!window.confirm(`Are you sure you want to delete "${skillName}"?`)) return;

    try {
      setError('');
      setSuccess('');
      await deleteSkill(id);
      setSkillsList(prev => prev.filter(s => s.id !== id));
      setSuccess(`Skill "${skillName}" removed successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete skill.');
    }
  };

  // Group raw skill objects by category for grid display
  const categoriesMap = new Map();
  CATEGORY_NAMES.forEach(cat => categoriesMap.set(cat, []));

  skillsList.forEach(skillObj => {
    const cat = skillObj.category || 'General';
    if (!categoriesMap.has(cat)) {
      categoriesMap.set(cat, []);
    }
    categoriesMap.get(cat).push(skillObj);
  });

  const categoriesToRender = Array.from(categoriesMap.entries()).map(([name, skills]) => ({
    name,
    skills,
  }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-xs font-mono text-slate-400">Loading Skills Matrix from Supabase...</p>
      </div>
    );
  }

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

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-xs text-slate-300">Category</label>
          <select
            value={selectedCatName}
            onChange={e => setSelectedCatName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-500"
          >
            {CATEGORY_NAMES.map(catName => (
              <option key={catName} value={catName}>{catName}</option>
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
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-heading font-semibold flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Add Skill'}</span>
        </button>
      </form>

      {/* Skill Categories Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoriesToRender.map(cat => (
          <div key={cat.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <h3 className="font-heading font-bold text-white text-base">{cat.name}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.skills.length === 0 ? (
                <span className="text-xs text-slate-500 font-mono italic">No skills in this category yet.</span>
              ) : (
                cat.skills.map((skillObj) => (
                  <span
                    key={skillObj.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono flex items-center gap-2 border border-slate-700"
                  >
                    <span>{skillObj.name}</span>
                    <button
                      onClick={() => handleDeleteSkill(skillObj.id, skillObj.name)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete Skill"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
