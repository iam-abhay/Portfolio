import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { INITIAL_CERTIFICATIONS } from '../lib/data';

export default function Certifications({ certs = INITIAL_CERTIFICATIONS }) {
  if (!certs || certs.length === 0) return null;

  return (
    <section id="certifications" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Certifications & Training
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Verified technical certifications and specialized developer training.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between hover:border-sky-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[11px] font-mono font-medium">
                    {cert.date}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                  {cert.name}
                </h3>
                
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {cert.issuer}
                </p>

                {cert.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {cert.description}
                  </p>
                )}
              </div>

              {cert.credential_url && cert.credential_url !== '#' && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500"
                  >
                    <span>View Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
