import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, Cpu, Briefcase, Award, Plus, CheckCircle2, Loader2, 
  Activity, TrendingUp, Terminal, Shield, RefreshCw, Layers 
} from 'lucide-react';
import { fetchAdminProjects, fetchAdminSkills, fetchAdminExperience, fetchAdminCertifications } from '../../lib/adminApi';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    certifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveLogs, setLiveLogs] = useState([]);
  const [sysLoad, setSysLoad] = useState(34);

  // Load metrics from Supabase
  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        setError('');
        const [projects, skills, experience, certifications] = await Promise.all([
          fetchAdminProjects(),
          fetchAdminSkills(),
          fetchAdminExperience(),
          fetchAdminCertifications(),
        ]);

        const countsData = {
          projects: projects?.length || 0,
          skills: skills?.length || 0,
          experience: experience?.length || 0,
          certifications: certifications?.length || 0,
        };
        setCounts(countsData);

        // Seed initial system logs
        setLiveLogs([
          { time: getTimestamp(), text: 'System initialized successfully.' },
          { time: getTimestamp(), text: 'Connection to Supabase established.' },
          { time: getTimestamp(), text: `Fetched database metrics: ${countsData.projects} projects, ${countsData.skills} skills loaded.` },
        ]);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  // Periodic live log simulation and Load variance to make it look "dynamic & live"
  useEffect(() => {
    if (loading) return;

    const logPhrases = [
      'Performing health check... OK',
      'Git sync queue listening for database changes.',
      'Supabase storage session refreshed.',
      'Fetched new visitor indicators from remote metadata.',
      'EmailJS direct routing gateway listening... Status: Ready',
      'Admin session active at abhaykharat.er@gmail.com',
      'Local dev-server middleware sync channels ready.',
      'Auto-backup cron schedule idling... Status: Healthy'
    ];

    const interval = setInterval(() => {
      // Add random log
      const randomText = logPhrases[Math.floor(Math.random() * logPhrases.length)];
      setLiveLogs(prev => [
        ...prev.slice(-4), // keep last 5 logs
        { time: getTimestamp(), text: randomText }
      ]);

      // Shift simulated system load
      setSysLoad(prev => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(15, Math.min(85, prev + delta));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [loading]);

  const getTimestamp = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  const stats = [
    { label: 'Projects Showcase', count: counts.projects, icon: FolderGit2, color: 'from-sky-500 to-blue-600', textGlow: 'text-sky-400', path: '/admin/projects' },
    { label: 'Skills Registered', count: counts.skills, icon: Cpu, color: 'from-indigo-500 to-purple-600', textGlow: 'text-indigo-400', path: '/admin/skills' },
    { label: 'Experience Entries', count: counts.experience, icon: Briefcase, color: 'from-emerald-500 to-teal-600', textGlow: 'text-emerald-400', path: '/admin/experience' },
    { label: 'Certifications', count: counts.certifications, icon: Award, color: 'from-amber-500 to-orange-600', textGlow: 'text-amber-400', path: '/admin/certifications' },
  ];

  return (
    <div className="space-y-8 relative">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-sky-500" />
            <span>Dashboard Overview</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visual monitoring system for your portfolio content engine.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Live System Status</span>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
        >
          {error}
        </motion.div>
      )}

      {/* Metrics Cards Grid (Glassmorphism & Tilt Animation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                y: -4,
                boxShadow: '0 20px 25px -5px rgba(14, 165, 233, 0.1), 0 10px 10px -5px rgba(14, 165, 233, 0.04)' 
              }}
              className="relative overflow-hidden p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-sky-500/30 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Background gradient sphere */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-slate-950 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-3xl font-heading font-extrabold text-white ${stat.textGlow} group-hover:scale-110 transition-transform duration-300 block`}>
                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-600" /> : stat.count}
                  </span>
                </div>
                
                <div>
                  <span className="text-xs font-heading font-bold text-slate-200 block group-hover:text-sky-400 transition-colors">
                    {stat.label}
                  </span>
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: loading ? 0 : `${Math.min(100, (stat.count / 15) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    />
                  </div>
                </div>
              </div>

              <Link
                to={stat.path}
                className="text-[10px] font-mono text-slate-500 hover:text-sky-400 hover:underline pt-4 flex items-center gap-1 self-start mt-auto"
              >
                <span>Navigate Manager</span>
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Graphical Dashboard Metrics & Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: System Activity Logger Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-7 p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-sky-500" />
              <h3 className="font-heading font-bold text-white text-sm">System Log Output</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Live Terminal feed</span>
          </div>

          <div className="font-mono text-xs text-sky-400/90 space-y-2 min-h-[140px] bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {liveLogs.map((log, lIdx) => (
                <motion.div
                  key={lIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="text-slate-600 shrink-0">[{log.time}]</span>
                  <span className="text-slate-500 shrink-0">$</span>
                  <span className="text-slate-300">{log.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 font-mono">
            <span>Buffer: 5 active entries</span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-sky-500" /> 
              <span>Logs syncing automatically</span>
            </span>
          </div>
        </motion.div>

        {/* Right Side: Virtual System indicators */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-500" />
              <h3 className="font-heading font-bold text-white text-sm">Indicator Analysis</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Real-time load</span>
          </div>

          <div className="space-y-4">
            {/* System Load Dial */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Simulated Gateway Load</span>
                <span className="font-mono text-sky-400 font-bold">{sysLoad}%</span>
              </div>
              <div className="h-2 bg-slate-850 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                  animate={{ width: `${sysLoad}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* API Health metrics */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">API Latency</span>
                <span className="text-base font-mono font-bold text-white mt-1 block">42ms</span>
              </div>
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Health status</span>
                <span className="text-base font-mono font-bold text-emerald-400 mt-1 block flex items-center justify-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" /> 100%
                </span>
              </div>
            </div>
          </div>

          {/* Quick CMS Control Shortcuts */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
            <Link
              to="/admin/projects"
              className="flex-1 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Project
            </Link>
            <Link
              to="/admin/skills"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-750"
            >
              <Plus className="w-3.5 h-3.5" /> Skill
            </Link>
          </div>
        </motion.div>
        
      </div>
      
    </div>
  );
}
