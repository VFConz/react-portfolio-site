'use client';

import { Suspense, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
/* Link not used for hash navigation — native <a> works better with Lenis */
import { personal } from '@/data/personal';
import { KineticText } from '@/components/animations/KineticText';
import { MagneticButton } from '@/components/ui/MagneticButton';

// Lazy-load the 3D scene to avoid SSR issues and improve initial load
const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then((mod) => ({ default: mod.HeroScene })),
  { ssr: false },
);

export function Hero() {
  const ctaRef = useRef<HTMLAnchorElement>(null);

  /* Scroll CTA fade-out: disappears as user begins scrolling */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!ctaRef.current) return;
      const scrollRatio = window.scrollY / (window.innerHeight * 0.15);
      const opacity = Math.max(0, 1 - scrollRatio);
      ctaRef.current.style.opacity = String(opacity);
      ctaRef.current.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* 3D Geometric Background */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/60 via-bg-primary/20 to-bg-primary/80" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center sm:gap-8">
        {/* Small label above name */}
        <span className="rounded-full border border-accent/20 bg-bg-primary/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-accent backdrop-blur-sm">
          Portfolio
        </span>

        {/* Kinetic animated name — center-out bloom with overshoot */}
        <KineticText
          text={personal.name}
          as="h1"
          className="font-display text-5xl font-bold leading-[0.9] tracking-[-0.02em] text-text-primary sm:text-7xl md:text-8xl lg:text-[100px] xl:text-[120px]"
          staggerMs={35}
          exitOnScroll
        />

        {/* Subtitle — gold accent with dark drop shadow */}
        <KineticText
          text={personal.title}
          as="p"
          className="text-base font-semibold uppercase tracking-[0.2em] text-accent drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] sm:text-lg md:text-xl"
          delay={600}
          staggerMs={25}
          exitOnScroll
        />

        {/* Social links with MagneticButton effect — increased strength (0.45) */}
        <div className="mt-6 flex gap-4">
          <MagneticButton
            as="a"
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-full border border-accent/30 px-7 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-accent hover:text-bg-primary"
            strength={0.45}
          >
            <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 group-hover:translate-x-0" />
            <span className="relative">LinkedIn</span>
          </MagneticButton>
          <MagneticButton
            as="a"
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-full border border-accent/30 px-7 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-accent hover:text-bg-primary"
            strength={0.45}
          >
            <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 group-hover:translate-x-0" />
            <span className="relative">GitHub</span>
          </MagneticButton>
        </div>

        {/* Scroll CTA — native <a> for reliable hash scroll with Lenis */}
        <a
          ref={ctaRef}
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById('about')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group mt-8 flex flex-col items-center gap-2 text-text-secondary transition-all duration-300 hover:text-accent"
        >
          <span className="text-xs uppercase tracking-[0.3em] transition-transform duration-300 group-hover:scale-105">
            Scroll
          </span>
          <span className="relative h-16 w-[2px] overflow-hidden rounded-full bg-border/60 transition-all duration-300 group-hover:h-20 group-hover:shadow-[0_0_8px_var(--color-accent)]">
            <span className="absolute left-0 h-2 w-full rounded-full bg-accent animate-[scrollPulse_2s_ease-in-out_infinite]" />
          </span>
        </a>
      </div>
    </div>
  );
}
