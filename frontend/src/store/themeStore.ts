import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  bannerFrom: string;
  bannerTo: string;
  isSidebarOpen: boolean;
  
  setThemeColor: (key: keyof Omit<ThemeState, 'setThemeColor' | 'isSidebarOpen' | 'setSidebarOpen' | 'resetTheme'>, color: string) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  resetTheme: () => void;
}

const defaultTheme = {
  primary: '#0f172a', // Slate 900
  secondary: '#64748b', // Slate 500
  success: '#10b981', // Emerald 500
  warning: '#f59e0b', // Amber 500
  error: '#ef4444', // Red 500
  bannerFrom: '#4f46e5', // Indigo 600
  bannerTo: '#ec4899',   // Pink 500
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Load current colors from defaults
      ...defaultTheme,
      primary: '#ff0000', // Override with user's specific current default
      secondary: '#818cf8',
      
      isSidebarOpen: false,

      setThemeColor: (key, color) => {
        set({ [key]: color });
        // Immediately inject the color into the DOM root so Tailwind picks it up
        document.documentElement.style.setProperty(`--theme-${key}`, color);
      },

      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      
      resetTheme: () => {
        const theme = {
          ...defaultTheme,
          primary: '#ff0000',
          secondary: '#818cf8',
        };
        set(theme);
        // Inject the resets into the DOM root
        Object.entries(theme).forEach(([k, v]) => {
          document.documentElement.style.setProperty(`--theme-${k}`, v);
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        primary: state.primary,
        secondary: state.secondary,
        success: state.success,
        warning: state.warning,
        error: state.error,
        bannerFrom: state.bannerFrom,
        bannerTo: state.bannerTo,
      }),
      onRehydrateStorage: () => (state) => {
        // Once state is loaded from local storage, inject all variables into the DOM
        if (state) {
          const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'bannerFrom', 'bannerTo'] as const;
          colors.forEach(key => {
            if (state[key]) {
              document.documentElement.style.setProperty(`--theme-${key}`, state[key]);
            }
          });
        }
      },
    }
  )
);
