import type { StompError } from "@/errors/stomp-errors";

export interface StompConnectionReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: StompError | null;
}

export interface StompPublishOptions {
  headers?: Record<string, string>;
  skipContentLengthHeader?: boolean;
}

export interface StompPublishReturn {
  publish: (destination: string, body: unknown, options?: StompPublishOptions) => Promise<boolean>;
  isConnected: boolean;
  error: StompError | null;
}

export interface StompSubscriptionOptions {
  headers?: Record<string, string>;
}

export type StompSubscriptionReturn = void;
