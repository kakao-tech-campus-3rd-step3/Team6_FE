import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  id: number | null;
  setAuth: (token: string, id: number) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      id: null,
      setAuth: (token: string, id: number) => set({ token, id }),
      clearAuth: () => set({ token: null, id: null }),
    }),
    {
      name: "icebreaking-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
