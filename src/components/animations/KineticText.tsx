'use client';
import { useRef, useEffect, useMemo } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerMs?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  /** When true, text animates out as the user scrolls past */
  exitOnScroll?: boolean;
}

export function KineticText({
  text,
  className = '',
  delay = 0,
  staggerMs = 30,
  as: Tag = 'div',
  exitOnScroll = false,
}: KineticTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const hoverHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const leaveHandlerRef = useRef<(() => void) | null>(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      const chars = container.querySelectorAll('.kinetic-char');
      gsap.set(chars, { y: 0, yPercent: 0, opacity: 1, rotationX: 0, scale: 1 });
      container
        .querySelectorAll('.char-wrapper')
        .forEach((el) => el.classList.remove('overflow-hidden'));
      return;
    }

    const chars = container.querySelectorAll('.kinetic-char');
    const charArray = Array.from(chars);

    /* ── Multi-axis initial state — randomized per character ── */
    charArray.forEach((char) => {
      const yOffset = 80 + Math.random() * 40; // 80% to 120%
      const rotX = -40 + Math.random() * 20; // -40° to -20°
      gsap.set(char, {
        yPercent: yOffset,
        opacity: 0,
        rotationX: rotX,
        scale: 0.7,
        transformPerspective: 600,
      });
    });

    /* ── Entry timeline: center-out stagger with overshoot ── */
    const tl = gsap.timeline({ delay: delay / 1000 });

    tl.to(chars, {
      yPercent: 0,
      opacity: 1,
      rotationX: 0,
      scale: 1,
      duration: 0.7,
      stagger: {
        each: staggerMs / 1000,
        from: 'center',
      },
      ease: 'back.out(1.4)',
    });

    /* ── Post-entry setup: remove clip, add hover, add scroll exit ── */
    tl.call(() => {
      /* Remove overflow-hidden to prevent descender clipping (g, j, p, q, y) */
      container
        .querySelectorAll('.char-wrapper')
        .forEach((el) => el.classList.remove('overflow-hidden'));

      /* ── Character hover interaction (desktop only) ── */
      if (!isMobile) {
        /* Use only quickTo for smooth y displacement — no competing
           gsap.to scale tweens, which caused jitter on large headings. */
        const quickYs = charArray.map((char) =>
          gsap.quickTo(char as HTMLElement, 'y', {
            duration: 0.5,
            ease: 'power2.out',
          }),
        );

        /* Cache character centers to avoid layout-thrashing
           getBoundingClientRect calls inside the mousemove handler. */
        let charCenters: { cx: number; cy: number }[] = [];
        const cachePositions = () => {
          charCenters = charArray.map((char) => {
            const rect = (char as HTMLElement).getBoundingClientRect();
            return {
              cx: rect.left + rect.width / 2,
              cy: rect.top + rect.height / 2,
            };
          });
        };
        cachePositions();
        window.addEventListener('scroll', cachePositions, { passive: true });
        window.addEventListener('resize', cachePositions);

        hoverHandlerRef.current = (e: MouseEvent) => {
          charCenters.forEach(({ cx, cy }, idx) => {
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              const factor = 1 - dist / 120;
              quickYs[idx](-factor * 6);
            } else {
              quickYs[idx](0);
            }
          });
        };

        leaveHandlerRef.current = () => {
          charArray.forEach((_, idx) => quickYs[idx](0));
          /* Also clear scroll/resize listeners on leave cleanup */
        };

        /* Store cachePositions ref for cleanup */
        (container as unknown as Record<string, unknown>).__cachePositions =
          cachePositions;

        container.addEventListener('mousemove', hoverHandlerRef.current);
        container.addEventListener('mouseleave', leaveHandlerRef.current);
      }

      /* ── Scroll-triggered exit animation ── */
      if (exitOnScroll) {
        gsap.to(chars, {
          yPercent: -30,
          opacity: 0,
          ease: 'none',
          stagger: 0.015,
          scrollTrigger: {
            trigger: container,
            start: 'top 30%',
            end: 'top -10%',
            scrub: 0.5,
          },
        });
      }
    });

    return () => {
      tl.kill();
      /* Kill scroll triggers on this container */
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
      /* Remove hover listeners */
      if (hoverHandlerRef.current) {
        container.removeEventListener('mousemove', hoverHandlerRef.current);
        hoverHandlerRef.current = null;
      }
      if (leaveHandlerRef.current) {
        container.removeEventListener('mouseleave', leaveHandlerRef.current);
        leaveHandlerRef.current = null;
      }
      /* Remove cached-position listeners */
      const cacheFn = (container as unknown as Record<string, unknown>)
        .__cachePositions as (() => void) | undefined;
      if (cacheFn) {
        window.removeEventListener('scroll', cacheFn);
        window.removeEventListener('resize', cacheFn);
      }
    };
  }, [text, delay, staggerMs, isMobile, exitOnScroll]);

  /* ── Split text into words, then characters with overflow clip wrappers ── */
  const words = text.split(' ');

  const renderContent = () =>
    words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block">
        {word.split('').map((char, charIndex) => (
          <span
            key={`${wordIndex}-${charIndex}`}
            className="char-wrapper inline-block overflow-hidden"
            style={{ perspective: '600px' }}
          >
            <span className="kinetic-char inline-block" aria-hidden="true">
              {char}
            </span>
          </span>
        ))}
        {wordIndex < words.length - 1 && (
          <span className="inline-block">&nbsp;</span>
        )}
      </span>
    ));

  switch (Tag) {
    case 'h1':
      return <h1 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className} aria-label={text}>{renderContent()}</h1>;
    case 'h2':
      return <h2 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className} aria-label={text}>{renderContent()}</h2>;
    case 'h3':
      return <h3 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className} aria-label={text}>{renderContent()}</h3>;
    case 'p':
      return <p ref={containerRef as React.RefObject<HTMLParagraphElement>} className={className} aria-label={text}>{renderContent()}</p>;
    case 'span':
      return <span ref={containerRef as React.RefObject<HTMLSpanElement>} className={className} aria-label={text}>{renderContent()}</span>;
    default:
      return <div ref={containerRef as React.RefObject<HTMLDivElement>} className={className} aria-label={text}>{renderContent()}</div>;
  }
}
