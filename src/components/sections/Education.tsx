'use client';

import Link from 'next/link';
import { education, type EducationItem } from '@/data/education';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { ScrollParallax } from '@/components/animations/ScrollParallax';

function EducationCard({ item, index }: { item: EducationItem; index: number }) {
  return (
    <RevealOnScroll delay={index * 0.1}>
      <div className="rounded-2xl border border-border bg-bg-secondary p-6 transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {item.href ? (
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-text-primary transition-colors hover:text-accent"
              >
                {item.institution}
              </Link>
            ) : (
              <h3 className="text-lg font-semibold text-text-primary">
                {item.institution}
              </h3>
            )}
            {item.degree && (
              <p className="mt-1 text-sm text-accent">{item.degree}</p>
            )}
          </div>
          <span className="shrink-0 text-sm text-text-muted">{item.period}</span>
        </div>

        <ul className="mt-4 space-y-2">
          {item.achievements.map((achievement) => (
            <li
              key={achievement}
              className="flex items-center gap-2 text-text-secondary"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </RevealOnScroll>
  );
}

export function Education() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-28 lg:py-36">
      <RevealOnScroll>
        <ScrollParallax speed={-20}>
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.3em] text-text-muted">
            Academic background
          </p>
          <h2 className="mb-20 text-center font-display text-4xl font-bold sm:text-5xl">
            <span className="text-gradient">Education</span>
          </h2>
        </ScrollParallax>
      </RevealOnScroll>

      <div className="grid gap-8 md:grid-cols-2">
        {education.map((item, index) => (
          <EducationCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
