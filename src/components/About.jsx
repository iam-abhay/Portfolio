import React from 'react';
import { motion } from 'framer-motion';
import { User, Server, Code, Database, LineChart, CheckCircle2 } from 'lucide-react';
import { PROFILE_DATA } from '../lib/data';

export default function About({ profile = PROFILE_DATA }) {
  const highlights = [
    {
      icon: Server,
      title: "Java & Backend Engineering",
      desc: "Architecting Java 21, Spring Boot REST APIs, Spring Security JWT, and microservice structures."
    },
    {
      icon: Code,
      title: "Full-Stack Web Development",
      desc: "Building clean, responsive client-side interfaces using React, JavaScript ES6+, and Tailwind CSS."
    },
    {
      icon: Database,
      title: "Database Management",
      desc: "Designing normalized PostgreSQL & MySQL relational schemas, indexing, and HikariCP connection pooling."
    },
    {
      icon: LineChart,
      title: "Data Analytics & Engineering Interest",
      desc: "Applying Python, Pandas, NumPy, and SQL analysis to build robust data ingestion pipelines."
    }
  ];

  return (
    <section id="about" className="py-24 relative bg-slate-100/50 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-medium">
            <User className="w-3.5 h-3.5" />
            <span>About Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Engineering Clean Code & Scalable Systems
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Focused on building robust backend infrastructure and intuitive user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Bio Text Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
          >
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
              Professional Summary
            </h3>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {profile.about}
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Key Engineering Focus Areas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Java & Spring Boot APIs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>React & Tailwind Interfaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>PostgreSQL & SQL Querying</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Data Pipelines & Python</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
          >
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-sky-500/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
