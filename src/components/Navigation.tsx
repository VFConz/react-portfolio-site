'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useThemeStore } from '@/store/theme';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export function Navigation() {
  const {
    activeSection,
    scrollProgress,
    isMobileMenuOpen,
    setActiveSection,
    setScrollProgress,
    toggleMobileMenu,
    closeMobileMenu,
  } = useNavigationStore();

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setScrollProgress(progress);

    const sectionElements = sections
      .map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }))
      .filter((s) => s.el !== null);

    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const { id, el } = sectionElements[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) {
          setActiveSection(id);
          break;
        }
      }
    }
  }, [setActiveSection, setScrollProgress]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* Scroll progress indicator bar */}
      <div className="fixed top-0 right-0 left-0 z-50 h-[2px] bg-bg-secondary/50">
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Desktop navigation - fixed left sidebar */}
      <nav className="fixed top-0 left-0 z-40 hidden h-screen w-16 flex-col items-center justify-center gap-6 border-r border-border bg-bg-primary/80 backdrop-blur-sm lg:flex">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            className="group relative flex h-10 w-10 items-center justify-center"
            onClick={() => setActiveSection(section.id)}
          >
            <span
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'scale-150 bg-accent shadow-lg shadow-accent/50'
                  : 'bg-text-muted group-hover:bg-text-secondary group-hover:scale-125'
              }`}
            />
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-primary opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
              {section.label}
            </span>
          </Link>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-accent hover:text-accent"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <motion.div
            animate={{ rotate: theme === 'dark' ? 0 : 180 }}
            transition={{ duration: 0.5 }}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </motion.div>
        </button>
      </nav>

      {/* Mobile navigation - hamburger button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-primary/90 backdrop-blur-sm lg:hidden"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1.5">
          <motion.span
            className="h-0.5 w-5 bg-text-primary"
            animate={isMobileMenuOpen ? { y: 8, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="h-0.5 w-5 bg-text-primary"
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="h-0.5 w-5 bg-text-primary"
            animate={isMobileMenuOpen ? { y: -8, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </button>

      {/* Mobile full-screen overlay menu with staggered reveals */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-bg-primary/95 backdrop-blur-md lg:hidden"
          >
            {sections.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <Link
                  href={`#${section.id}`}
                  onClick={closeMobileMenu}
                  className={`text-3xl font-medium transition-colors ${
                    activeSection === section.id
                      ? 'text-accent'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {section.label}
                </Link>
              </motion.div>
            ))}

            {/* Theme toggle in mobile menu */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sections.length * 0.08, duration: 0.3 }}
              onClick={toggleTheme}
              className="mt-4 rounded-full border border-border px-6 py-3 text-sm text-text-secondary transition-colors hover:text-accent hover:border-accent"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
