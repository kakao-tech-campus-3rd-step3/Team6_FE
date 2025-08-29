export interface ErrorConfig {
  code: ErrorCode;
  statusCode?: number;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorConfigEntry {
  statusCode?: number;
  defaultMessage: string;
}

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "BAD_GATEWAY"
  | "SERVICE_UNAVAILABLE"
  | "GATEWAY_TIMEOUT"
  | "NETWORK_ERROR"
  | "TOKEN_EXPIRED"
  | "VALIDATION_ERROR"
  | "UNKNOWN_ERROR";
