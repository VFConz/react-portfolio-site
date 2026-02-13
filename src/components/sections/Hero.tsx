'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { personal } from '@/data/personal';
import { KineticText } from '@/components/animations/KineticText';
import { MagneticButton } from '@/components/ui/MagneticButton';

// Lazy-load the 3D scene to avoid SSR issues and improve initial load
const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then((mod) => ({ default: mod.HeroScene })),
  { ssr: false },
);

export function Hero() {
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

        {/* Kinetic animated name — warm cream on dark */}
        <KineticText
          text={personal.name}
          as="h1"
          className="font-display text-5xl font-bold leading-[0.9] tracking-[-0.02em] text-text-primary sm:text-7xl md:text-8xl lg:text-[100px] xl:text-[120px]"
          staggerMs={35}
        />

        {/* Subtitle — gold accent with dark drop shadow */}
        <KineticText
          text={personal.title}
          as="p"
          className="text-base font-semibold uppercase tracking-[0.2em] text-accent drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] sm:text-lg md:text-xl"
          delay={600}
          staggerMs={25}
        />

        {/* Social links with MagneticButton effect */}
        <div className="mt-6 flex gap-4">
          <MagneticButton
            as="a"
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-full border border-accent/30 px-7 py-3 text-sm font-medium text-text-primary transition-all duration-300 hover:border-accent hover:text-bg-primary"
            strength={0.3}
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
            strength={0.3}
          >
            <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 group-hover:translate-x-0" />
            <span className="relative">GitHub</span>
          </MagneticButton>
        </div>

        {/* Scroll CTA */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <Link
            href="#about"
            className="flex flex-col items-center gap-2 text-text-muted transition-colors hover:text-accent"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <span className="relative h-12 w-[1px] overflow-hidden bg-border">
              <span className="absolute top-0 left-0 h-4 w-full animate-[scrollLine_2s_ease-in-out_infinite] bg-accent" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
