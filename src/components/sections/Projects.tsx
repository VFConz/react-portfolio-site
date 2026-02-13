'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, type ProjectItem } from '@/data/projects';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { ScrollParallax } from '@/components/animations/ScrollParallax';

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: ProjectItem;
  index: number;
  featured?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <RevealOnScroll delay={index * 0.1}>
      {/* Card with lift + shadow + border glow on hover — NO 3D tilt */}
      <div
        className={`group rounded-2xl border border-border bg-bg-secondary transition-all duration-300 hover:border-accent/60 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent/10 ${
          featured ? 'md:col-span-2' : ''
        }`}
      >
        {/* Project image with device-style frame */}
        <div
          className={`relative flex items-center justify-center overflow-hidden rounded-t-2xl ${
            featured ? 'h-64 sm:h-72 md:h-80' : 'h-52 sm:h-56'
          }`}
          style={{ backgroundColor: `${project.accentColor}10` }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/60 to-transparent" />

          {/* CSS-only laptop frame */}
          <div
            className={`relative transition-transform duration-500 group-hover:scale-[1.03] ${
              featured ? 'w-[55%] max-w-[400px]' : 'w-[70%] max-w-[280px]'
            }`}
          >
            {/* Screen bezel */}
            <div className="rounded-t-lg border-[4px] border-bg-elevated bg-bg-elevated shadow-lg">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-black">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-center"
                  sizes={featured ? '(max-width: 768px) 80vw, 400px' : '(max-width: 768px) 60vw, 280px'}
                />
              </div>
            </div>
            {/* Bottom bar */}
            <div className="mx-auto h-[8px] w-[110%] max-w-full rounded-b-lg bg-gradient-to-b from-border to-bg-elevated" />
            <div className="mx-auto h-[3px] w-[35%] rounded-b bg-border/50" />
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className={`font-semibold text-text-primary ${
                  featured ? 'font-display text-xl sm:text-2xl' : 'text-lg'
                }`}
              >
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-text-muted">{project.subtitle}</p>
            </div>
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full border border-border p-2 transition-all duration-300 hover:border-accent hover:text-accent hover:scale-110"
                aria-label={`View ${project.title} on GitHub`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
          </div>

          {/* Tech tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/50 bg-bg-elevated px-3 py-1 text-xs text-text-muted transition-colors hover:text-accent"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Features list */}
          <ul className="mt-4 space-y-1.5">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-text-secondary"
              >
                <span
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: project.accentColor }}
                />
                {feature}
              </li>
            ))}
          </ul>

          {/* Expandable detail view — stays flat and accessible */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            {expanded ? 'Show Less' : 'Read More'}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {project.details}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </RevealOnScroll>
  );
}

export function Projects() {
  const [firstProject, ...restProjects] = projects;

  return (
    <div className="mx-auto max-w-6xl px-6 py-28 lg:py-36">
      <RevealOnScroll>
        <ScrollParallax speed={-20}>
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.3em] text-text-muted">
            Selected work
          </p>
          <h2 className="mb-20 text-center font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            <span className="text-gradient">Projects</span>
          </h2>
        </ScrollParallax>
      </RevealOnScroll>

      {/* Featured first project (full width) */}
      {firstProject && (
        <div className="mb-8">
          <ProjectCard project={firstProject} index={0} featured />
        </div>
      )}

      {/* Remaining projects in 2-col grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {restProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index + 1} />
        ))}
      </div>
    </div>
  );
}
