import type { StompError } from "@/errors/stomp-errors";

export interface StompState {
  isConnected: boolean;
  isConnecting: boolean;
  error: StompError | null;
}

export type StateListener = (state: StompState) => void;

export type Unsubscribe = () => void;
