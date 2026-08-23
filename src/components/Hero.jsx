import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, Github, Linkedin, Mail, Code2, Database, Terminal, Sparkles, Download } from 'lucide-react';

const getResumeUrl = (url) => {
  if (!url || url === '#') {
    return `${import.meta.env.BASE_URL}assets/resume.pdf`;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  return `${import.meta.env.BASE_URL}${cleanUrl}`;
};

const getProfileImageUrl = (url) => {
  if (!url) {
    return `${import.meta.env.BASE_URL}assets/images/profile.jpg`;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  return `${import.meta.env.BASE_URL}${cleanUrl}`;
};

export default function Hero({ profile, onOpenTerminal }) {
  const roles = [
    "Java Backend / Full-Stack Developer",
    "Spring Boot & PostgreSQL Engineer",
    "Data Analytics & Engineering Enthusiast",
    "Software Engineer | SKNCOE Graduate (2026)"
  ];
  
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIdx];
    let speed = isDeleting ? 30 : 70;

    if (!isDeleting && displayedText === currentRole) {
      speed = 2000;
    } else if (isDeleting && displayedText === '') {
      speed = 300;
    }

    const handleTyping = () => {
      if (!isDeleting) {
        if (displayedText.length < currentRole.length) {
          setDisplayedText(currentRole.substring(0, displayedText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentRole.substring(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setRoleIdx((roleIdx + 1) % roles.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIdx]);

  return (
    <section id="hero" className="min-h-screen pt-28 sm:pt-36 pb-16 flex items-center relative overflow-hidden">
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Text Content */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-mono font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              Open to Software Engineering Opportunities
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                {profile.name || "Abhay Dilip Kharat"}
              </h1>
              
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400 min-h-[36px] flex items-center">
                <span>{displayedText}</span>
                <span className="w-0.5 h-6 ml-1 bg-sky-500 animate-pulse inline-block" />
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
            >
              Building scalable backend services and responsive web applications. Passionate about computer science fundamentals, high-performance system architecture, and delivering impactful software solutions.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href="#projects"
                className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-heading font-semibold text-sm shadow-lg shadow-sky-600/25 hover:shadow-sky-600/40 transition-all flex items-center gap-2 group"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={getResumeUrl(profile.resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-heading font-semibold text-sm border border-slate-300 dark:border-slate-800 transition-all flex items-center gap-2 group"
                  title="View Resume in New Tab"
                >
                  <FileText className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
                  <span>Resume</span>
                </a>
                
                <a
                  href={getResumeUrl(profile.resumeUrl)}
                  download="Abhay_Kharat_Resume.pdf"
                  className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 transition-all flex items-center justify-center group"
                  title="Download Resume PDF"
                  aria-label="Download Resume PDF"
                >
                  <Download className="w-4 h-4 text-emerald-500 group-hover:translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* CLI Shell Launcher */}
              {onOpenTerminal && (
                <button
                  onClick={onOpenTerminal}
                  className="px-5 py-3.5 rounded-xl bg-slate-950 dark:bg-slate-950 text-sky-400 border border-slate-700 dark:border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 transition-all font-mono text-sm flex items-center gap-2.5 group shadow-inner"
                  title="Launch Developer Shell"
                >
                  <Terminal className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="font-heading font-semibold text-sky-300 text-sm">CLI Shell</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-2 sm:ml-4">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
                  aria-label="Send Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Visual 3D Glassmorphism Card / Profile Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-sky-500/15 hover:-translate-y-1 hover:rotate-1 transition-all duration-300 space-y-6 group">
              <div className="flex items-center gap-4">
                {!imageError ? (
                  <img
                    src={getProfileImageUrl(profile.profileImageUrl)}
                    alt="Abhay Kharat Profile"
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
                    AK
                  </div>
                )}
                <div>
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
                    Abhay Dilip Kharat
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    B.E. ENTC | SKNCOE
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <Code2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Java 21, Spring Boot, React, SQL</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <Database className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>PostgreSQL, HikariCP, REST APIs</span>
                </div>
              </div>



              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60">
                  <span className="block font-heading font-bold text-sky-600 dark:text-sky-400 text-lg">3+</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Core Projects</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60">
                  <span className="block font-heading font-bold text-sky-600 dark:text-sky-400 text-lg">2026</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Graduation</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
