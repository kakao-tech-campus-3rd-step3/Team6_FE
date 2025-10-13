export const STOMP_CONNECTION_ERRORS = {
  STOMP_CONNECTION_FAILED: {
    defaultMessage: "STOMP 연결에 실패했습니다.",
  },
  STOMP_SUBSCRIPTION_FAILED: {
    defaultMessage: "STOMP 구독에 실패했습니다.",
  },
  STOMP_PUBLISH_FAILED: {
    defaultMessage: "메시지 발송에 실패했습니다.",
  },
  STOMP_MESSAGE_PARSE_ERROR: {
    defaultMessage: "메시지 파싱 중 오류가 발생했습니다.",
  },
  STOMP_UNAUTHORIZED: {
    defaultMessage: "STOMP 인증에 실패했습니다.",
  },
  STOMP_PROTOCOL_ERROR: {
    defaultMessage: "STOMP 프로토콜 오류가 발생했습니다.",
  },
  STOMP_WEBSOCKET_ERROR: {
    defaultMessage: "웹소켓 연결 오류가 발생했습니다.",
  },
  STOMP_WEBSOCKET_CLOSE: {
    defaultMessage: "웹소켓 연결이 종료되었습니다.",
  },
  STOMP_ACTIVATION_FAILED: {
    defaultMessage: "STOMP 활성화에 실패했습니다.",
  },
  STOMP_NO_TOKEN: {
    defaultMessage: "인증 토큰이 없습니다.",
  },
  STOMP_NOT_CONNECTED: {
    defaultMessage: "STOMP 클라이언트가 연결되지 않았습니다.",
  },
  STOMP_UNKNOWN_ERROR: {
    defaultMessage: "알 수 없는 STOMP 오류가 발생했습니다.",
  },
} as const;
