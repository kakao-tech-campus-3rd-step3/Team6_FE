import type { StompErrorCode, StompErrorConfigEntry } from "@/errors/types";

export const STOMP_ERROR_CONFIGS: Record<StompErrorCode, StompErrorConfigEntry> = {
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
  INTERNAL_SERVER_ERROR: {
    defaultMessage: "서버 내부 오류가 발생했습니다.",
  },
  USER_NOT_FOUND: {
    defaultMessage: "사용자를 찾을 수 없습니다.",
  },
  INVALID_MBTI_TYPE: {
    defaultMessage: "유효하지 않은 MBTI 타입입니다.",
  },
  USER_NOT_AUTHENTICATED: {
    defaultMessage: "사용자가 인증되지 않았습니다.",
  },
  ROOM_NOT_FOUND: {
    defaultMessage: "방을 찾을 수 없습니다.",
  },
  ROOM_ALREADY_EXISTS: {
    defaultMessage: "방이 이미 존재합니다.",
  },
  WAITING_ROOM_NOT_FOUND: {
    defaultMessage: "대기방을 찾을 수 없습니다.",
  },
  WAITING_ROOM_FULL: {
    defaultMessage: "대기방이 가득 찼습니다.",
  },
  ALREADY_ROOM_JOIN: {
    defaultMessage: "이미 방에 가입되어있습니다.",
  },
  ROOM_CAPACITY_EXCEEDED: {
    defaultMessage: "방 정원을 초과했습니다.",
  },
  INVALID_STAGE_VALUE: {
    defaultMessage: "유효하지 않은 스테이지 값입니다.",
  },
  USER_NOT_IN_ROOM: {
    defaultMessage: "사용자가 방에 속해있지 않습니다.",
  },
  INVALID_STAGE_EVENT_VALUE: {
    defaultMessage: "유효하지 않은 스테이지 이벤트 타입입니다.",
  },
  INVALID_STAGE_TRANSITION: {
    defaultMessage: "유효하지 않은 스테이지 전환입니다.",
  },
  ROOM_STAGE_NOT_FOUND: {
    defaultMessage: "방의 현재 스테이지를 찾을 수 없습니다.",
  },
  ROOM_OWNER_NOT_FOUND: {
    defaultMessage: "방장이 존재하지 않습니다.",
  },
  ROOM_OWNER_MISMATCH: {
    defaultMessage: "멤버에게는 허용되지 않은 요청입니다.",
  },
  INVALID_ROOM_STAGE: {
    defaultMessage: "유효하지 않은 방 스테이지입니다.",
  },
  ROOM_STAGE_NOT_INITIALIZED: {
    defaultMessage: "방 스테이지가 초기화되지 않았습니다.",
  },
  INIT_STAGE_EVENT_NOT_ALLOWED: {
    defaultMessage: "해당 요청에 INIT 이벤트는 허용되지 않습니다.",
  },
  QUESTION_NOT_FOUND: {
    defaultMessage: "질문을 찾을 수 없습니다.",
  },
  INVALID_QUESTION_TYPE: {
    defaultMessage: "유효하지 않은 질문 타입입니다.",
  },
  INVALID_INTEREST_TYPE: {
    defaultMessage: "유효하지 않은 관심사 타입입니다.",
  },
  INVALID_GAME_CATEGORY: {
    defaultMessage: "유효하지 않은 게임 카테고리입니다.",
  },
  INVALID_JWT_PAYLOAD: {
    defaultMessage: "유효하지 않은 JWT 페이로드입니다.",
  },
  EXPIRED_JWT_TOKEN: {
    defaultMessage: "만료된 JWT 토큰입니다.",
  },
  INVALID_JWT_TOKEN: {
    defaultMessage: "유효하지 않은 JWT 토큰입니다.",
  },
  INVALID_JWT_SIGNATURE: {
    defaultMessage: "유효하지 않은 JWT 서명입니다.",
  },
  INVALID_REQUEST: {
    defaultMessage: "유효하지 않은 요청입니다.",
  },
} as const;
