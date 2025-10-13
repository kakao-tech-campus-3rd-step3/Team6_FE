export const AUTH_ERRORS = {
  USER_NOT_AUTHENTICATED: {
    defaultMessage: "사용자가 인증되지 않았습니다.",
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
} as const;
