'use client';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Direction = 'up' | 'down' | 'left' | 'right';

interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  stagger?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

const directionMap: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export function RevealOnScroll({
  children,
  direction = 'up',
  delay = 0,
  stagger = 0,
  duration = 0.8,
  distance,
  className = '',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const offset = directionMap[direction];
    const dist = distance ?? 40;
    const scaleX = offset.x !== 0 ? (offset.x / 40) * dist : 0;
    const scaleY = offset.y !== 0 ? (offset.y / 40) * dist : 0;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(ref.current, { opacity: 1 });
      return;
    }

    const targets = stagger > 0 ? ref.current.children : ref.current;

    gsap.set(targets, {
      opacity: 0,
      x: scaleX,
      y: scaleY,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      stagger: stagger > 0 ? stagger : undefined,
      ease: 'power3.out',
    });

    return () => {
      // Only kill this instance's ScrollTrigger, not all of them
      const st = tl.scrollTrigger;
      if (st) st.kill();
      tl.kill();
    };
  }, [direction, delay, stagger, duration, distance]);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
}
