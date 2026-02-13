'use client';
import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme';

/**
 * Applies the 'dark' or 'light' class to <html> and syncs
 * with system preference on first load.
 * Adds a CSS transition on background/text color for smooth toggling.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  // Sync with system preference on first mount (only if no stored preference)
  useEffect(() => {
    const stored = localStorage.getItem('theme-preference');
    if (!stored) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      if (!prefersDark && theme === 'dark') {
        toggleTheme();
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);

    // Add transition for smooth theme switching
    root.style.transition =
      'background-color 0.3s ease, color 0.3s ease';
  }, [theme]);

  return <>{children}</>;
}
