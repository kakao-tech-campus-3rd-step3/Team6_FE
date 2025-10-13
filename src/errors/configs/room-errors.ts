export const ROOM_ERRORS = {
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
  USER_NOT_IN_ROOM: {
    defaultMessage: "사용자가 방에 속해있지 않습니다.",
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
  INVALID_STAGE_VALUE: {
    defaultMessage: "유효하지 않은 스테이지 값입니다.",
  },
  INVALID_STAGE_EVENT_VALUE: {
    defaultMessage: "유효하지 않은 스테이지 이벤트 타입입니다.",
  },
  INVALID_STAGE_TRANSITION: {
    defaultMessage: "유효하지 않은 스테이지 전환입니다.",
  },
  INIT_STAGE_EVENT_NOT_ALLOWED: {
    defaultMessage: "해당 요청에 INIT 이벤트는 허용되지 않습니다.",
  },
} as const;
