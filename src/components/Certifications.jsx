import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { fetchCertifications } from '../lib/api';

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCertifications();
        if (isMounted) {
          setCerts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load certifications from Supabase.');
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-xs font-mono">Fetching certification credentials from Supabase...</p>
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

        {/* Certifications Grid */}
        {!loading && !error && (
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
        )}

      </div>
    </section>
  );
}
