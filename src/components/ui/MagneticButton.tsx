'use client';
import { useRef, useCallback } from 'react';
import { gsap } from '@/lib/gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

/**
 * Magnetic cursor button that follows the mouse position
 * relative to the button center with smooth GSAP animation.
 *
 * Enhanced with:
 * - Scale proximity effect (button "breathes" toward cursor)
 * - Subtle tilt rotation for parallax depth
 * - Dynamic border glow following cursor angle
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  as: Tag = 'button',
  href,
  target,
  rel,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const quickToX = useRef<gsap.QuickToFunc | null>(null);
  const quickToY = useRef<gsap.QuickToFunc | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;

      // Check for reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      /* ── Magnetic pull via quickTo (60fps) ── */
      if (!quickToX.current) {
        quickToX.current = gsap.quickTo(ref.current, 'x', {
          duration: 0.4,
          ease: 'power3.out',
        });
      }
      if (!quickToY.current) {
        quickToY.current = gsap.quickTo(ref.current, 'y', {
          duration: 0.4,
          ease: 'power3.out',
        });
      }

      quickToX.current(deltaX);
      quickToY.current(deltaY);

      /* ── Scale + rotation proximity effect ── */
      const maxDist = Math.max(rect.width, rect.height) * 1.5;
      const dist = Math.sqrt(
        (e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2,
      );
      const normalizedDist = Math.min(1, dist / maxDist);
      const targetScale = 1 + (1 - normalizedDist) * 0.06;
      const tiltAngle = deltaX * 0.03;

      gsap.to(ref.current, {
        scale: targetScale,
        rotation: tiltAngle,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      /* ── Dynamic border glow following cursor angle ── */
      const glowX = (e.clientX - centerX) * 0.12;
      const glowY = (e.clientY - centerY) * 0.12;
      ref.current.style.boxShadow = `${glowX}px ${glowY}px 20px rgba(185, 148, 46, 0.12)`;
    },
    [strength],
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
    ref.current.style.boxShadow = 'none';
  }, []);

  const sharedProps = {
    className: `inline-block ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
  };

  if (Tag === 'a') {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        {...sharedProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      {...sharedProps}
    >
      {children}
    </button>
  );
}
