'use client';
import { useRef, useCallback } from 'react';
import { gsap } from '@/lib/gsap';

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

/**
 * Card with subtle 3D tilt on mouse move.
 * Image inside shifts slightly opposite to mouse direction.
 */
export function ParallaxCard({
  children,
  className = '',
  intensity = 10,
}: ParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(cardRef.current, {
        rotateY: x * intensity,
        rotateX: -y * intensity,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });

      // Shift inner image opposite to mouse
      const img = cardRef.current.querySelector('img');
      if (img) {
        gsap.to(img, {
          x: -x * intensity * 0.8,
          y: -y * intensity * 0.8,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    },
    [intensity],
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power3.out',
    });

    const img = cardRef.current.querySelector('img');
    if (img) {
      gsap.to(img, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`will-change-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
