import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = { id: string; email: string; role: string; firstName: string };

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User, refreshToken?: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      setAuth: (token, user, refreshToken) =>
        set((state) => ({ token, user, refreshToken: refreshToken ?? state.refreshToken })),
      logout: () => set({ token: null, refreshToken: null, user: null }),
    }),
    { name: "soair-auth" }
  )
);