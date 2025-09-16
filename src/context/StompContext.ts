import { Client } from "@stomp/stompjs";
import { type ReactNode, createContext } from "react";

export interface StompContextProps {
  client: Client | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
}

export interface StompProviderProps {
  children: ReactNode;
  brokerURL: string;
  token: string;
}

export const StompContext = createContext<StompContextProps>({
  client: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  reconnectAttempts: 0,
});
