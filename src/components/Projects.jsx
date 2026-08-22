import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, ExternalLink, Github, X } from 'lucide-react';
import { INITIAL_PROJECTS } from '../lib/data';
import ProjectCard from './ProjectCard';

export default function Projects({ projectsList = INITIAL_PROJECTS }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    'All',
    'Software Engineering',
    'Full Stack',
    'AI / ML',
    'Data Analytics',
    'Data Engineering'
  ];

  // Filter projects by category
  const filteredProjects = projectsList.filter(proj => {
    if (!proj.published && proj.published !== undefined) return false;
    if (activeCategory === 'All') return true;
    return (
      proj.category === activeCategory ||
      proj.secondaryCategory === activeCategory ||
      (activeCategory === 'Full Stack' && (proj.category?.includes('Full') || proj.title?.includes('Real Estate')))
    );
  });

  return (
    <section id="projects" className="py-24 relative bg-slate-100/50 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Portfolio Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Software & Engineering Projects
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Real software systems, full-stack applications, and backend services built with modern Java, React, and SQL stacks.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex justify-center items-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid using ProjectCard component */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id || idx}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
            No published projects found under '{activeCategory}'. Check back soon for new project additions!
          </div>
        )}

      </div>

      {/* Detailed Project Modal View */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                  {selectedProject.title}
                </h3>
              </div>

              <div className="h-56 rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={selectedProject.image_url || 'assets/images/project-ai-analytics.jpg'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-1">
                    Project Overview
                  </h4>
                  <p>{selectedProject.description}</p>
                </div>

                {selectedProject.metrics && (
                  <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-300 text-xs font-medium">
                    ⚡ <strong>Key Metric / Impact:</strong> {selectedProject.metrics}
                  </div>
                )}

                <div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-2">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-heading font-semibold flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" /> GitHub Repository
                  </a>
                )}
                {selectedProject.live_url && (
                  <a
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-heading font-semibold flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
