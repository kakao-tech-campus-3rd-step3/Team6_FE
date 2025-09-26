export interface StompConnectionReturn {
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
  headers?: Record<string, string>;
}

export type StompSubscriptionReturn = void;
