'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Fixed top bar showing scroll progress across the full page.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-50 h-[3px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
