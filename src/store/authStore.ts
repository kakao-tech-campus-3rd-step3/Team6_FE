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
      //TODO : 토큰 저장 방식을 어떻게 할지, XSS생각하면 토큰을 메모리에 저장
      // partialize를 적용하면 새로고침 시 토큰이 사라져 재접속(재연결)시 힘들 수 있음
      // partialize: (state) => ({ id: state.id }),
    },
  ),
);
