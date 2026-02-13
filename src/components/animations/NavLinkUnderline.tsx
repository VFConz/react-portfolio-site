'use client';
import { motion } from 'framer-motion';

interface NavLinkUnderlineProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  isActive?: boolean;
}

/**
 * Navigation link with an animated sliding underline on hover.
 */
export function NavLinkUnderline({
  children,
  href,
  className = '',
  isActive = false,
}: NavLinkUnderlineProps) {
  return (
    <motion.a
      href={href}
      className={`group relative inline-block ${className}`}
      whileHover="hover"
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-accent"
        initial={{ width: isActive ? '100%' : '0%' }}
        variants={{
          hover: { width: '100%' },
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ width: isActive ? '100%' : '0%' }}
      />
    </motion.a>
  );
}
