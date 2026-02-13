'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences, type ExperienceItem } from '@/data/experience';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { ScrollParallax } from '@/components/animations/ScrollParallax';

function ExperienceCard({ item, index }: { item: ExperienceItem; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <RevealOnScroll delay={index * 0.1}>
      <div className="group relative pl-8 pb-12 last:pb-0">
        {/* Timeline line */}
        <div className="absolute top-0 left-0 h-full w-px bg-border" />
        {/* Timeline dot */}
        <div className="absolute top-1 -left-[5px] h-[11px] w-[11px] rounded-full border-2 border-accent bg-bg-primary transition-all duration-300 group-hover:scale-125" />

        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all duration-300 hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary">
                {item.role}
              </h3>
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-accent transition-colors hover:text-accent-hover"
              >
                {item.company}
              </Link>
            </div>
            <span className="shrink-0 text-sm text-text-muted">{item.period}</span>
          </div>

          <p className="mt-3 text-text-secondary">{item.description}</p>

          {/* Skills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {item.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-bg-elevated px-3 py-1 text-xs text-text-muted"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Expandable detail */}
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
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
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                  {item.details}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </RevealOnScroll>
  );
}

export function Experience() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-28 lg:py-36">
      <RevealOnScroll>
        <ScrollParallax speed={-20}>
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.3em] text-text-muted">
            Where I&apos;ve worked
          </p>
          <h2 className="mb-20 text-center font-display text-4xl font-bold sm:text-5xl">
            <span className="text-gradient">Experience</span>
          </h2>
        </ScrollParallax>
      </RevealOnScroll>

      <div className="relative">
        {experiences.map((item, index) => (
          <ExperienceCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
