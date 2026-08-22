import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Code2 } from 'lucide-react';

export default function GitHubSection({ profile }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Graceful fetch from public GitHub API
    fetch('https://api.github.com/users/iam-abhay/repos?sort=updated&per_page=6')
      .then((res) => {
        if (!res.ok) throw new Error('GitHub API rate limited or unavailable');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback default repos if API is unavailable or rate limited
        setRepos([
          {
            id: 1,
            name: 'Portfolio',
            description: 'Modern developer portfolio built with React, Vite, Tailwind CSS, and Supabase.',
            language: 'JavaScript',
            stargazers_count: 1,
            forks_count: 0,
            html_url: 'https://github.com/iam-abhay/Portfolio'
          },
          {
            id: 2,
            name: 'AgriEase',
            description: 'AI-Powered Smart Agriculture Platform with Java Spring Boot backend and React web client.',
            language: 'Java',
            stargazers_count: 2,
            forks_count: 1,
            html_url: 'https://github.com/iam-abhay'
          },
          {
            id: 3,
            name: 'MoodFlix',
            description: 'Mood-Based Movie Recommendation System using Java 21, JavaFX, and HikariCP PostgreSQL connection pool.',
            language: 'Java',
            stargazers_count: 1,
            forks_count: 0,
            html_url: 'https://github.com/iam-abhay'
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="github" className="py-24 relative bg-slate-100/50 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
            <Github className="w-3.5 h-3.5" />
            <span>Open Source & Code</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            GitHub Contributions & Repositories
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Explore code repositories, Java microservices implementations, and open-source projects on GitHub.
          </p>
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {repos.map((repo, idx) => (
            <motion.div
              key={repo.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:border-sky-500/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading font-bold text-slate-900 dark:text-white text-base hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-1"
                  >
                    {repo.name}
                  </a>
                  <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                  {repo.description || 'Developer project repository on GitHub.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>{repo.language || 'Code'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    {repo.stargazers_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" />
                    {repo.forks_count || 0}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GitHub Callout */}
        <div className="mt-12 text-center">
          <a
            href={profile.github || 'https://github.com/iam-abhay'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-heading font-semibold text-sm shadow-md transition-all"
          >
            <Github className="w-4 h-4" />
            <span>Visit @iam-abhay on GitHub</span>
          </a>
        </div>

      </div>
    </section>
  );
}
