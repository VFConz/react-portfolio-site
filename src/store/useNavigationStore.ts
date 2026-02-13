import { create } from 'zustand';

interface NavigationState {
  activeSection: string;
  scrollProgress: number;
  isMobileMenuOpen: boolean;
  setActiveSection: (section: string) => void;
  setScrollProgress: (progress: number) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: 'hero',
  scrollProgress: 0,
  isMobileMenuOpen: false,
  setActiveSection: (section) => set({ activeSection: section }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
