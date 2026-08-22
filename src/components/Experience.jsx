import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { fetchExperience } from '../lib/api';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExperience();
        if (isMounted) {
          setExperiences(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load experience records from Supabase.');
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
    <section id="experience" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Development History</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Practical Experience
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Software engineering projects, application development, and open-source code contributions.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-xs font-mono">Fetching development history from Supabase...</p>
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

        {/* Timeline List */}
        {!loading && !error && (
          <div className="max-w-3xl mx-auto relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-12">
            {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id || idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Dot Icon */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-950 border-4 border-sky-500 group-hover:scale-125 transition-transform" />

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.start_date} — {exp.current ? 'Present' : exp.end_date}
                  </span>

                  {exp.location && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg">
                    {exp.position}
                  </h3>
                  <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
                    {exp.company}
                  </p>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {exp.description}
                </p>

                {exp.technologies && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}

      </div>
    </section>
  );
}
