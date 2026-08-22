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

export default function HomePage() {
  const [terminalOpen, setTerminalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors relative">
      {/* 3D Interactive Particle Canvas Constellation Background */}
      <ParticleCanvas />

      <Navbar onOpenTerminal={() => setTerminalOpen(true)} />
      <main>
        <Hero onOpenTerminal={() => setTerminalOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <GitHubSection />
        <Contact />
      </main>
      <Footer />

      {/* Interactive CLI Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
    </div>
  );
}
