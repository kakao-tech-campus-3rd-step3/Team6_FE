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

export interface StompErrorConfig {
  code: StompErrorCode;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface StompErrorConfigEntry {
  defaultMessage: string;
}

export type StompErrorCode =
  | "STOMP_CONNECTION_FAILED"
  | "STOMP_SUBSCRIPTION_FAILED"
  | "STOMP_PUBLISH_FAILED"
  | "STOMP_MESSAGE_PARSE_ERROR"
  | "STOMP_UNAUTHORIZED"
  | "STOMP_PROTOCOL_ERROR"
  | "STOMP_WEBSOCKET_ERROR"
  | "STOMP_WEBSOCKET_CLOSE"
  | "STOMP_ACTIVATION_FAILED"
  | "STOMP_NO_TOKEN"
  | "STOMP_NOT_CONNECTED"
  | "STOMP_UNKNOWN_ERROR";
