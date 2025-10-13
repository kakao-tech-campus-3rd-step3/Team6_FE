import type { StompError } from "@/errors/stomp-errors";

export interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export interface RowProps {
  label: string;
  value: string;
  status?: "normal" | "success" | "warning" | "error";
}

export interface DebugInfo {
  messageHandlersSize: number;
  stompSubscriptionsSize: number;
  stateListenersSize: number;
  messageHandlers: Array<{ destination: string; handlerCount: number }>;
  stompSubscriptions: string[];
  state: {
    isConnected: boolean;
    isConnecting: boolean;
    error: StompError | null;
  };
}

export interface PerformanceWithMemory extends Performance {
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}
