'use client';
import { motion } from 'framer-motion';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  hoverY?: number;
}

/**
 * Wraps children in a motion div that lifts on hover.
 * Use for project cards and interactive card elements.
 */
export function HoverCard({
  children,
  className = '',
  hoverY = -8,
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ y: hoverY, transition: { duration: 0.3, ease: 'easeOut' } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
