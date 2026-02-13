'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, type ProjectItem } from '@/data/projects';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { ScrollParallax } from '@/components/animations/ScrollParallax';

/* ─── Single project card ─── */
function ProjectCard({
  project,
  index,
  reversed = false,
}: {
  project: ProjectItem;
  index: number;
  reversed?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, '0');

  return (
    <RevealOnScroll delay={index * 0.08}>
      <div
        className={`group grid items-center gap-0 overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-all duration-500 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/8 md:grid-cols-2 ${
          reversed ? 'md:direction-rtl' : ''
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Image panel ── */}
        <div
          className={`relative overflow-hidden ${
            reversed ? 'md:order-2 md:direction-ltr' : ''
          }`}
        >
          {/* Accent stripe along the edge */}
          <div
            className={`absolute top-0 z-10 h-full w-1 ${
              reversed ? 'left-0' : 'right-0'
            }`}
            style={{ backgroundColor: project.accentColor }}
          />

          {/* Image container — large, edge-to-edge */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg-elevated">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Hover overlay with description */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6"
                >
                  <p className="text-sm leading-relaxed text-white/90">
                    {project.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Content panel ── */}
        <div
          className={`flex flex-col justify-center p-8 sm:p-10 md:p-12 ${
            reversed ? 'md:order-1 md:direction-ltr' : ''
          }`}
        >
          {/* Number + category */}
          <div className="mb-4 flex items-center gap-3">
            <span
              className="font-display text-3xl font-bold leading-none sm:text-4xl"
              style={{ color: project.accentColor }}
            >
              {num}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
              {project.subtitle}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
            {project.title}
          </h3>

          {/* Brief details — max 2 lines */}
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">
            {project.details}
          </p>

          {/* Tech stack */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA link */}
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              View on GitHub
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </RevealOnScroll>
  );
}

/* ─── Projects section ─── */
export function Projects() {
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

      {/* Alternating left/right project cards */}
      <div className="flex flex-col gap-10 md:gap-14">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            reversed={index % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
}
