'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

const cubicBezier = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const overlayVariants = {
  hidden: { x: '100%' },
  visible: {
    x: '0%',
    transition: { duration: 0.4, ease: cubicBezier },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.3, ease: cubicBezier },
  },
} as const;

const linkVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
  exit: { opacity: 0, x: 40, transition: { duration: 0.2 } },
};

/**
 * Mobile menu overlay that slides in from the right
 * with staggered link reveals.
 */
export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Menu panel */}
          <motion.nav
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 z-50 flex h-full w-[75vw] max-w-[320px] flex-col justify-center bg-bg-secondary/95 px-10 backdrop-blur-md"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-2xl text-text-secondary transition-colors hover:text-text-primary"
              aria-label="Close menu"
            >
              ✕
            </button>
            {/* Links */}
            <ul className="flex flex-col gap-8">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="text-3xl font-semibold text-text-primary transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
