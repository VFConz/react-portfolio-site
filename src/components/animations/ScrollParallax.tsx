'use client';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollParallaxProps {
  children: React.ReactNode;
  speed?: number; // How much the element moves relative to scroll (negative = opposite direction)
  className?: string;
}

/**
 * Applies scrub-based scroll parallax to its children.
 * `speed` controls the vertical shift: positive moves faster, negative moves slower.
 * Uses GSAP ScrollTrigger with scrub for buttery smooth motion linked to scroll position.
 */
export function ScrollParallax({
  children,
  speed = -30,
  className = '',
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.to(ref.current, {
      y: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8, // smooth scrub with slight lag
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === ref.current)
        .forEach((t) => t.kill());
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
