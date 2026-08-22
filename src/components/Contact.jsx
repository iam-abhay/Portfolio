import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin, Copy, Check, Send } from 'lucide-react';

export default function Contact({ profile }) {
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email || 'iamabhaykharat@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
            <Mail className="w-3.5 h-3.5" />
            <span>Recruiter & Developer Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Get In Touch
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Open to software engineering roles, Java backend opportunities, and technical collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Contact Details & Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg">
                Direct Contact Channels
              </h3>

              {/* Email Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="block text-[11px] font-mono text-slate-400 uppercase">Email</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate block">
                      {profile.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors border border-slate-200 dark:border-slate-600 shrink-0"
                  title="Copy Email Address"
                  aria-label="Copy Email Address"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone Card */}
              {profile.phone && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Send className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <span className="block text-[11px] font-mono text-slate-400 uppercase">Phone</span>
                      <a href={`tel:${profile.phone}`} className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-sky-500 transition-colors block">
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono text-slate-400 uppercase">Location</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    {profile.location || 'Pune, India | Open to Remote & Relocation'}
                  </span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-heading font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-sky-600 text-white text-xs font-heading font-semibold flex items-center justify-center gap-2 hover:bg-sky-500 transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg">
                Send a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-semibold text-slate-700 dark:text-slate-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Recruiter / Engineer Name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-semibold text-slate-700 dark:text-slate-300">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-heading font-semibold text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="Opportunity Inquiry / Project Discussion"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-heading font-semibold text-slate-700 dark:text-slate-300">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hello Abhay, I reviewed your profile and would like to discuss..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-heading font-semibold text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Direct Inquiry</span>
              </button>

              {formSent && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center pt-2">
                  ✓ Thank you! Your message inquiry has been recorded.
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
