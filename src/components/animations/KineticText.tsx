'use client';
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerMs?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export function KineticText({
  text,
  className = '',
  delay = 0,
  staggerMs = 30,
  as: Tag = 'div',
}: KineticTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      const chars = containerRef.current.querySelectorAll('.kinetic-char');
      gsap.set(chars, { y: 0, opacity: 1 });
      // Remove overflow-hidden immediately since there's no animation
      containerRef.current
        .querySelectorAll('.char-wrapper')
        .forEach((el) => el.classList.remove('overflow-hidden'));
      return;
    }

    const chars = containerRef.current.querySelectorAll('.kinetic-char');

    gsap.set(chars, { y: '100%', opacity: 0 });

    const tl = gsap.timeline({ delay: delay / 1000 });

    tl.to(chars, {
      y: '0%',
      opacity: 1,
      duration: 0.6,
      stagger: staggerMs / 1000,
      ease: 'power3.out',
    });

    // Remove overflow-hidden AFTER all staggered characters finish animating
    // to prevent clipping of descender glyphs (g, j, p, q, y)
    tl.call(() => {
      if (containerRef.current) {
        containerRef.current
          .querySelectorAll('.char-wrapper')
          .forEach((el) => el.classList.remove('overflow-hidden'));
      }
    });

    return () => {
      tl.kill();
    };
  }, [text, delay, staggerMs]);

  // Split text into words, then characters with overflow hidden wrappers
  const words = text.split(' ');

  const renderContent = () =>
    words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block">
        {word.split('').map((char, charIndex) => (
          <span
            key={`${wordIndex}-${charIndex}`}
            className="char-wrapper inline-block overflow-hidden"
          >
            <span className="kinetic-char inline-block" aria-hidden="true">
              {char}
            </span>
          </span>
        ))}
        {/* Add space between words */}
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
