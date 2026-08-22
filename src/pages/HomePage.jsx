import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Certifications from '../components/Certifications';
import GitHubSection from '../components/GitHubSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import TerminalModal from '../components/TerminalModal';
import ParticleCanvas from '../components/ParticleCanvas';
import { fetchProfile } from '../lib/api';
import { Loader2, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load public profile from Supabase.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // Global Keyboard listener (` or Ctrl+K) for quick CLI terminal access
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      } else if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
        <p className="text-sm font-mono text-slate-400">Loading Portfolio Profile from Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 max-w-lg space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-heading font-bold text-rose-400">Database Connection Notice</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors relative">
      {/* 3D Interactive Particle Canvas Constellation Background */}
      <ParticleCanvas />

      <Navbar profile={profile} onOpenTerminal={() => setTerminalOpen(true)} />
      <main>
        <Hero profile={profile} onOpenTerminal={() => setTerminalOpen(true)} />
        <About profile={profile} />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <GitHubSection profile={profile} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />

      {/* Interactive CLI Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        profile={profile}
      />
    </div>
  );
}
