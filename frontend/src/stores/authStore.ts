import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Company } from '@/services/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedCompanyId: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setSelectedCompany: (companyId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      selectedCompanyId: null,

      setAuth: (user, token) => {
        const defaultCompany = user.companies?.[0];
        set({
          user,
          token,
          isAuthenticated: true,
          selectedCompanyId: defaultCompany?.id || null,
        });
      },

      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      setSelectedCompany: (companyId) => set({ selectedCompanyId: companyId }),

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          selectedCompanyId: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        selectedCompanyId: state.selectedCompanyId,
      }),
    }
  )
);