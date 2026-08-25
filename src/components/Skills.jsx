import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Code2, Server, Layout, Database, Wrench, Activity, BarChart2, Loader2, AlertCircle } from 'lucide-react';
import { fetchSkills } from '../lib/api';

export default function Skills() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSkillsData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSkills();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load technical skills from Supabase.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadSkillsData();
    return () => {
      isMounted = false;
    };
  }, []);

  const iconMap = {
    languages: Code2,
    backend: Server,
    frontend: Layout,
    database: Database,
    databases: Database,
    'cloud-devops': Wrench,
    devops: Wrench,
    tools: Wrench,
    monitoring: Activity,
    data: BarChart2,
    'data-analytics-bi': BarChart2,
  };

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Skills</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Engineering & Technology Ecosystem
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Categorized technical stack focused on backend performance, web applications, databases, and data tooling.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-xs font-mono">Fetching technical skills ecosystem from Supabase...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 max-w-xl mx-auto text-center space-y-2 my-8">
            <AlertCircle className="w-6 h-6 mx-auto text-rose-500" />
            <h4 className="font-heading font-bold text-sm">Database Connection Notice</h4>
            <p className="text-xs leading-relaxed">{error}</p>
          </div>
        )}

        {/* Skills Category Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const IconComponent = iconMap[cat.id] || Cpu;

            return (
              <motion.div
                key={cat.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-sky-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    {cat.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200/60 dark:border-slate-700/60 hover:bg-sky-50 dark:hover:bg-slate-700/80 hover:text-sky-600 dark:hover:text-sky-300 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
        )}

      </div>
    </section>
  );
}
