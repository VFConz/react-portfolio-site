'use client';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
}

/**
 * A button with scale hover/tap animations.
 */
export function AnimatedButton({
  children,
  className = '',
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
