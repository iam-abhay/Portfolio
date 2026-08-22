import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { INITIAL_EDUCATION } from '../lib/data';

export default function Education({ educationList = INITIAL_EDUCATION }) {
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

        {/* Education List */}
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

      </div>
    </section>
  );
}
