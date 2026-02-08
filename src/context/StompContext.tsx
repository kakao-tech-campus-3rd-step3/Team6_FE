import { stageNavigator } from "@/services/stomp/StageNavigator";
import { StompService } from "@/services/stomp/StompService";
import { useAuthStore } from "@/store/authStore";
import { type ReactNode, createContext, useContext, useEffect, useMemo } from "react";

interface StompContextValue {
  stompService: StompService;
}

const StompContext = createContext<StompContextValue | null>(null);

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const stompService = useMemo(() => new StompService(), []);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws-stomp";
    stompService.initialize(wsUrl, () => useAuthStore.getState().token);
    stageNavigator.setStompService(stompService);

    return () => {
      stompService.deactivate();
    };
  }, [stompService]);

  useEffect(() => {
    if (token) {
      stompService.activate();
    } else {
      stompService.deactivate();
    }
  }, [token, stompService]);

  return <StompContext.Provider value={{ stompService }}>{children}</StompContext.Provider>;
};

export const useStompContext = () => {
  const context = useContext(StompContext);
  if (!context) {
    throw new Error("useStompContext must be used within a StompProvider");
  }
  return context.stompService;
};
