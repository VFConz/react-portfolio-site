'use client';

import Image from 'next/image';
import { personal } from '@/data/personal';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { ScrollParallax } from '@/components/animations/ScrollParallax';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const skills = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'JavaScript',
  'Java',
  'Kotlin',
  'C++',
  'AWS',
  'SQL',
  'Git',
  'Tailwind CSS',
  'HTML/CSS',
  'Auth0',
  'REST APIs',
];

const stats = [
  { label: 'Year Industry Experience', target: 1, suffix: '+' },
  { label: 'Projects Completed', target: 6, suffix: '+' },
  { label: 'Technologies', target: 15, suffix: '+' },
  { label: 'Grade Average', target: 80, suffix: '%' },
];

export function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-28 lg:py-36">
      <RevealOnScroll>
        <ScrollParallax speed={-20}>
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.3em] text-text-muted">
            Get to know me
          </p>
          <h2 className="mb-20 text-center font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            <span className="text-gradient">About Me</span>
          </h2>
        </ScrollParallax>
      </RevealOnScroll>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Profile image */}
        <RevealOnScroll direction="left">
          <div className="flex items-center justify-center">
            <div className="relative h-72 w-72 overflow-hidden rounded-2xl border border-border shadow-2xl shadow-accent/5 sm:h-80 sm:w-80">
              <Image
                src={personal.profileImage}
                alt={personal.name}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 640px) 288px, 320px"
                priority
              />
            </div>
          </div>
        </RevealOnScroll>

        {/* Bio text */}
        <RevealOnScroll direction="right" delay={0.15}>
          <div className="flex flex-col justify-center">
            <p className="text-lg leading-relaxed text-text-secondary">
              {personal.bio}
            </p>
          </div>
        </RevealOnScroll>
      </div>

      {/* Stats row with animated counters */}
      <RevealOnScroll delay={0.2}>
        <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-bg-secondary p-6 text-center transition-colors hover:border-accent/30"
            >
              <div className="text-3xl font-bold text-accent sm:text-4xl">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>
              <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      {/* Skills / technology tags */}
      <RevealOnScroll delay={0.3}>
        <div className="mt-20">
          <h3 className="mb-8 text-center text-xl font-semibold text-text-primary">
            Technologies &amp; Skills
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-bg-elevated px-4 py-2 text-sm text-text-secondary transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
