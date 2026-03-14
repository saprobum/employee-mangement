import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '../services/auth';
import type { User, LoginCredentials } from '../types/auth';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Login action
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login(credentials);
          
          // Store tokens and user in localStorage
          localStorage.setItem('auth_token', response.tokens.accessToken);
          localStorage.setItem('auth_refresh_token', response.tokens.refreshToken);
          localStorage.setItem('auth_user', JSON.stringify(response.user));

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Login failed:', error);
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear all auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_refresh_token');
          localStorage.removeItem('auth_user');
          
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      // Update user in state
      updateUser: (userData: Partial<User>) => {
        const currentState = get();
        if (currentState.user) {
          const updatedUser = { ...currentState.user, ...userData } as User;
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
          set({ user: updatedUser });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Check if user is authenticated
      checkAuth: async (): Promise<boolean> => {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (!token || !storedUser) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return false;
        }

        try {
          const user = JSON.parse(storedUser) as User;
          
          // Verify token is still valid (in real app, call API to validate)
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return true;
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          set({ isAuthenticated: false, user: null, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist user and isAuthenticated
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate auth state:', error);
          return;
        }
        
        // After rehydration, verify auth status
        if (state) {
          state.checkAuth();
        }
      },
    }
  )
);

// Selector hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useUserPermissions = () => useAuthStore((state) => state.user?.permissions || []);
export const useUserRole = () => useAuthStore((state) => state.user?.role);
