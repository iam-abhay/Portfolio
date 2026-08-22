import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minimize2, Maximize2, Send, CornerDownLeft } from 'lucide-react';
import { PROFILE_DATA, INITIAL_PROJECTS, SKILL_CATEGORIES } from '../lib/data';

export default function TerminalModal({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Abhay Kharat Developer Shell v2.5.0 [x86_64-pc-linux-gnu]' },
    { type: 'system', text: 'Type "help" to list available interactive commands.' }
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', text: `abhay@portfolio:~$ ${input}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `Available commands:
  help       - Display available CLI commands
  about      - Display professional summary & background
  skills     - List technical skill matrix
  projects   - List featured software engineering projects
  experience - View development experience
  education  - View academic details (SKNCOE)
  contact    - Display direct contact details & social links
  clear      - Clear terminal history
  sudo       - Execute admin privileges
  exit       - Close terminal modal`
        });
        break;

      case 'about':
        newHistory.push({
          type: 'output',
          text: `${PROFILE_DATA.name} | ${PROFILE_DATA.headline}\n\n${PROFILE_DATA.about}`
        });
        break;

      case 'skills':
        const skillText = SKILL_CATEGORIES.map(
          cat => `\x1b[1m[${cat.name}]\x1b[0m: ${cat.skills.join(', ')}`
        ).join('\n');
        newHistory.push({ type: 'output', text: skillText });
        break;

      case 'projects':
        const projText = INITIAL_PROJECTS.map(
          (p, i) => `${i + 1}. ${p.title} (${p.category})\n   Stack: ${p.technologies.join(', ')}\n   URL: ${p.github_url}`
        ).join('\n\n');
        newHistory.push({ type: 'output', text: projText });
        break;

      case 'contact':
        newHistory.push({
          type: 'output',
          text: `Email:    ${PROFILE_DATA.email}\nGitHub:   ${PROFILE_DATA.github}\nLinkedIn: ${PROFILE_DATA.linkedin}\nLocation: ${PROFILE_DATA.location}`
        });
        break;

      case 'education':
        newHistory.push({
          type: 'output',
          text: `Institution: Smt. Kashibai Navale College of Engineering (SKNCOE)\nDegree:      Bachelor of Engineering (Electronics & Telecommunication)\nGraduation:  2027 (Expected)`
        });
        break;

      case 'experience':
        newHistory.push({
          type: 'output',
          text: `Role:        Java & Full-Stack Developer\nFocus:       Spring Boot Microservices, PostgreSQL, React, JWT Security`
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'sudo':
        newHistory.push({
          type: 'output',
          text: `[AUTH REQUIRED] Accessing hidden admin portal route: /admin ... Redirecting permission check.`
        });
        break;

      case 'exit':
        onClose();
        setInput('');
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `Command not found: "${cmd}". Type "help" for a list of available commands.`
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-3xl rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs text-slate-200 flex flex-col h-[520px]"
          >
            {/* Terminal Window Header Bar */}
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center group"
                  aria-label="Close Terminal"
                >
                  <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100" />
                </button>
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>

              <div className="flex items-center gap-2 text-slate-400 font-semibold text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>abhay@portfolio-cli: ~</span>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono leading-relaxed bg-slate-950">
              {history.map((item, idx) => (
                <div key={idx}>
                  {item.type === 'user' && (
                    <div className="text-sky-400 font-bold">{item.text}</div>
                  )}
                  {item.type === 'system' && (
                    <div className="text-slate-400 italic">{item.text}</div>
                  )}
                  {item.type === 'output' && (
                    <pre className="text-emerald-400 whitespace-pre-wrap font-mono text-[11px] leading-relaxed pl-2 border-l-2 border-emerald-500/40 py-1">
                      {item.text}
                    </pre>
                  )}
                  {item.type === 'error' && (
                    <div className="text-rose-400">{item.text}</div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Terminal Command Input Form */}
            <form
              onSubmit={handleCommand}
              className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
            >
              <span className="text-sky-400 font-bold text-xs">abhay@portfolio:~$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type 'help', 'projects', 'skills'..."
                className="flex-1 bg-transparent border-none outline-none text-slate-100 text-xs font-mono placeholder:text-slate-600 focus:ring-0"
                autoFocus
                spellCheck="false"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center gap-1 text-[10px] font-semibold"
              >
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
