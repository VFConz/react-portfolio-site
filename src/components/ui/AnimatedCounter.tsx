'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/**
 * Animated counter that counts from 0 to target number
 * when scrolled into view. Uses GSAP tween with ScrollTrigger.
 *
 * Usage:
 *   <AnimatedCounter target={15} suffix="+" />      → "15+"
 *   <AnimatedCounter target={5} suffix=" Years" />   → "5 Years"
 *   <AnimatedCounter target={20} suffix="+" />       → "20+"
 */
export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ value: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    counterRef.current.value = 0;
    setDisplay(0);

    const tween = gsap.to(counterRef.current, {
      value: target,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      onUpdate: () => {
        setDisplay(Math.round(counterRef.current.value));
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [target, duration]);

  return (
    <span
      ref={ref}
      className={`tabular-nums ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
