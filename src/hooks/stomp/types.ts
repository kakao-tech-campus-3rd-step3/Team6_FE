import type { Client } from "@stomp/stompjs";

export interface StompConnectionReturn {
  client: Client | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export interface StompPublishOptions {
  headers?: Record<string, string>;
  skipContentLengthHeader?: boolean;
}

export interface StompPublishReturn {
  publish: (destination: string, body: unknown, options?: StompPublishOptions) => Promise<boolean>;
  isConnected: boolean;
  error: string | null;
}

export interface StompSubscriptionOptions {
  id?: string;
  ack?: "client-individual" | "client" | "auto";
  headers?: Record<string, string>;
}

export interface StompSubscriptionReturn {
  isSubscribed: boolean;
  error: string | null;
}
