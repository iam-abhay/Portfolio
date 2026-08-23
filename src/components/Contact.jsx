import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin, Copy, Check, Send, Loader2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

// EmailJS configuration — update these with your actual IDs
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_portfolio';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_contact';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export default function Contact({ profile }) {
  const [copied, setCopied] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email || 'iamabhaykharat@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setErrorMsg('');

    const formData = new FormData(formRef.current);
    const name = formData.get('from_name');
    const email = formData.get('from_email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // If EmailJS public key is configured, send via EmailJS
    if (EMAILJS_PUBLIC_KEY) {
      try {
        const templateParams = {
          name: name,
          email: email,
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
        setFormStatus('sent');
        formRef.current.reset();
        setTimeout(() => setFormStatus('idle'), 5000);
      } catch (err) {
        console.error('EmailJS error:', err);
        setFormStatus('error');
        setErrorMsg('Failed to send message. Please try emailing directly.');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } else {
      // Fallback: open mailto link with pre-filled content
      const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nSubject: ${subject}\n\nMessage:\n${message}`
      );
      const recipientEmail = profile.email || 'iamabhaykharat@gmail.com';
      window.open(`mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank');
      setFormStatus('sent');
      formRef.current.reset();
      setTimeout(() => setFormStatus('idle'), 5000);
    }
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
            Open to software engineering roles, backend opportunities, and technical collaborations.
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
              ref={formRef}
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
                    name="from_name"
                    required
                    placeholder="HR / Recruiter / Engineer Name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-semibold text-slate-700 dark:text-slate-300">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="from_email"
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
                  name="subject"
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
                  name="message"
                  required
                  placeholder="Hello Abhay, I reviewed your profile and would like to discuss..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-sky-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-heading font-semibold text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formStatus === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Direct Inquiry</span>
                  </>
                )}
              </button>

              {formStatus === 'sent' && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center pt-2 flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Thank you! Your message has been sent successfully. I'll get back to you soon.
                </p>
              )}

              {formStatus === 'error' && (
                <p className="text-xs text-red-500 dark:text-red-400 font-medium text-center pt-2 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
