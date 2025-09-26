export interface StompState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export type StateListener = (state: StompState) => void;

export type Unsubscribe = () => void;
