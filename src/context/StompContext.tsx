import { MockSignalService } from "@/__test__/mocks/MockSignalService";
import { SignalDevTool } from "@/components/dev/SignalDevTool";
import { stageNavigator } from "@/services/stomp/StageNavigator";
import { StompService } from "@/services/stomp/StompService";
import { SIGNAL_TARGETS, type SignalMode } from "@/services/stomp/signalTargets";
import { useAuthStore } from "@/store/authStore";
import { Fragment, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { StompContext } from "./stompContextValue";

const envMockSignal = import.meta.env.VITE_MOCK_SIGNAL === "true";

export const StompProvider = ({ children }: { children: ReactNode }) => {
  const stompService = useMemo(() => new StompService(), []);
  const mockSignalService = useMemo(() => new MockSignalService(), []);
  const token = useAuthStore((state) => state.token);

  const [signalMode, setSignalMode] = useState<SignalMode>(envMockSignal ? "mock" : "prod");
  const prevModeRef = useRef<SignalMode>(signalMode);

  const isMock = signalMode === "mock";
  const activeTarget = SIGNAL_TARGETS.find((t) => t.mode === signalMode)!;

  const setupMockMode = useCallback(() => {
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
  }, [stompService, mockSignalService]);

  const setupStompMode = useCallback(
    (wsUrl: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (stompService as any).subscribe = StompService.prototype.subscribe;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (stompService as any).publish = StompService.prototype.publish;

      stompService.initialize(wsUrl, () => useAuthStore.getState().token);
      stageNavigator.setSignalService(stompService);
    },
    [stompService],
  );

  useEffect(() => {
    if (isMock) {
      if (prevModeRef.current !== "mock") {
        stompService.deactivate();
      }
      setupMockMode();
    } else {
      if (prevModeRef.current !== "mock") {
        stompService.deactivate();
      }
      setupStompMode(activeTarget.wsUrl!);
    }

    prevModeRef.current = signalMode;

    return () => {
      if (!isMock) {
        stompService.deactivate();
      }
    };
  }, [signalMode, isMock, stompService, setupMockMode, setupStompMode, activeTarget]);

  useEffect(() => {
    if (isMock) return;

    if (token) {
      stompService.activate();
    } else {
      stompService.deactivate();
    }
  }, [token, stompService, isMock]);

  const handleModeChange = useCallback(
    (mode: SignalMode) => {
      if (mode === signalMode) return;
      console.log(`[Signal DevTool] 구현체 전환: ${signalMode} → ${mode}`);
      setSignalMode(mode);
    },
    [signalMode, setSignalMode],
  );

  return (
    <StompContext.Provider value={{ stompService }}>
      <Fragment key={signalMode}>{children}</Fragment>
      {import.meta.env.DEV && (
        <SignalDevTool
          mockService={mockSignalService}
          stompService={stompService}
          currentMode={signalMode}
          onModeChange={handleModeChange}
        />
      )}
    </StompContext.Provider>
  );
};
