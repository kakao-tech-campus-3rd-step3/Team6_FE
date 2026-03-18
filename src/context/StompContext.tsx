import { MockSignalService } from "@/__test__/mocks/MockSignalService";
import { SignalDevTool } from "@/components/dev/SignalDevTool";
import { stageNavigator } from "@/services/stomp/StageNavigator";
import { StompService } from "@/services/stomp/StompService";
import { useAuthStore } from "@/store/authStore";
import { type ReactNode, useEffect, useMemo } from "react";

import { StompContext } from "./stompContextValue";

const useMockSignal = import.meta.env.VITE_MOCK_SIGNAL === "true";

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const stompService = useMemo(() => new StompService(), []);
  const mockSignalService = useMemo(() => (useMockSignal ? new MockSignalService() : null), []);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (useMockSignal && mockSignalService) {
      stageNavigator.setSignalService(mockSignalService);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (stompService as any).setState({ isConnected: true, isConnecting: false });

      stompService.subscribe = (destination, callback) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return mockSignalService.subscribe(destination, (data) => callback(data as any, {} as any));
      };

      stompService.publish = (destination, body) => {
        console.log(`[Mock STOMP Publish] ${destination}`, body);
        return true;
      };

      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws-stomp";
    stompService.initialize(wsUrl, () => useAuthStore.getState().token);
    stageNavigator.setSignalService(stompService);

    return () => {
      stompService.deactivate();
    };
  }, [stompService, mockSignalService]);

  useEffect(() => {
    if (useMockSignal) return;

    if (token) {
      stompService.activate();
    } else {
      stompService.deactivate();
    }
  }, [token, stompService]);

  return (
    <StompContext.Provider value={{ stompService }}>
      {children}
      {useMockSignal && mockSignalService && <SignalDevTool mockService={mockSignalService} />}
    </StompContext.Provider>
  );
};
