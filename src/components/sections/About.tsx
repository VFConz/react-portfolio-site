'use client';

import { personal, skills, stats } from '@/data/personal';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { ScrollParallax } from '@/components/animations/ScrollParallax';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

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

      {/* Bio — single column, redesigned */}
      <RevealOnScroll>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-bg-secondary/50 px-8 py-10 shadow-lg shadow-accent/5 sm:px-12 sm:py-12">
            <p className="text-base leading-[1.8] text-text-secondary sm:text-lg">
              {personal.bio}
            </p>
          </div>
        </div>
      </RevealOnScroll>

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
