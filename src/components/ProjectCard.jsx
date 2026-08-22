import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Sparkles, ChevronRight } from 'lucide-react';

export default function ProjectCard({ project, onSelect }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-sky-500/50 transition-all"
    >
      {/* Project Image Thumbnail */}
      <div className="relative h-48 bg-slate-950 overflow-hidden">
        <img
          src={project.image_url || 'assets/images/project-ai-analytics.jpg'}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-sky-400 text-[11px] font-mono font-medium border border-slate-700/60">
            {project.category}
          </span>
        </div>
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col space-y-4">
        <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
          {project.title}
        </h3>

        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 flex-1">
          {project.short_description || project.description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.technologies?.slice(0, 4).map((tech, tIdx) => (
            <span
              key={tIdx}
              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-mono"
            >
              {tech}
            </span>
          ))}
          {project.technologies?.length > 4 && (
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-mono">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="View Source Code on GitHub"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live_url && project.live_url !== '#' && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-sky-500 transition-colors"
                aria-label="View Live Project Demo"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <button
            onClick={() => onSelect(project)}
            className="text-xs font-heading font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1 group/btn"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
