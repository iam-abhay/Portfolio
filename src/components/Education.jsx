import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award, Loader2, AlertCircle } from 'lucide-react';
import { fetchEducation } from '../lib/api';

export default function Education() {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEducation();
        if (isMounted) {
          setEducationList(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load education records from Supabase.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <section id="education" className="py-24 relative bg-slate-100/50 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Education
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Formal engineering degree and computer science fundamentals coursework.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-xs font-mono">Fetching academic records from Supabase...</p>
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

        {/* Education List */}
        {!loading && !error && (
          <div className="max-w-3xl mx-auto space-y-6">
            {educationList.map((edu, idx) => (
            <motion.div
              key={edu.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-sky-500/40 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {edu.start_date} — {edu.end_date}
                </span>
                {edu.grade && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                    {edu.grade}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-xl">
                  {edu.degree} {edu.branch ? `in ${edu.branch}` : ''}
                </h3>
                <p className="text-base font-medium text-sky-600 dark:text-sky-400">
                  {edu.institution}
                </p>
              </div>

              {edu.description && (
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {edu.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
        )}

      </div>
    </section>
  );
}
