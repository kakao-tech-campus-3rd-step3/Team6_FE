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
  | "STOMP_UNKNOWN_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "USER_NOT_FOUND"
  | "INVALID_MBTI_TYPE"
  | "USER_NOT_AUTHENTICATED"
  | "ROOM_NOT_FOUND"
  | "ROOM_ALREADY_EXISTS"
  | "WAITING_ROOM_NOT_FOUND"
  | "WAITING_ROOM_FULL"
  | "ALREADY_ROOM_JOIN"
  | "ROOM_CAPACITY_EXCEEDED"
  | "INVALID_STAGE_VALUE"
  | "USER_NOT_IN_ROOM"
  | "INVALID_STAGE_EVENT_VALUE"
  | "INVALID_STAGE_TRANSITION"
  | "ROOM_STAGE_NOT_FOUND"
  | "ROOM_OWNER_NOT_FOUND"
  | "ROOM_OWNER_MISMATCH"
  | "INVALID_ROOM_STAGE"
  | "ROOM_STAGE_NOT_INITIALIZED"
  | "INIT_STAGE_EVENT_NOT_ALLOWED"
  | "QUESTION_NOT_FOUND"
  | "INVALID_QUESTION_TYPE"
  | "INVALID_INTEREST_TYPE"
  | "INVALID_GAME_CATEGORY"
  | "INVALID_JWT_PAYLOAD"
  | "EXPIRED_JWT_TOKEN"
  | "INVALID_JWT_TOKEN"
  | "INVALID_JWT_SIGNATURE"
  | "INVALID_REQUEST";

export interface StompErrorResponse {
  status: "ERROR";
  data: null;
  error: {
    code: StompErrorCode;
    message: string;
  };
}
