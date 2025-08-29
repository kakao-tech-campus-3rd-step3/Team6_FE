export const ERROR_CONFIGS = {
  BAD_REQUEST: {
    statusCode: 400,
    defaultMessage: '잘못된 요청입니다.',
  },
  UNAUTHORIZED: {
    statusCode: 401,
    defaultMessage: '인증되지 않은 사용자입니다.',
  },
  FORBIDDEN: {
    statusCode: 403,
    defaultMessage: '접근 권한이 없습니다.',
  },
  NOT_FOUND: {
    statusCode: 404,
    defaultMessage: '리소스를 찾을 수 없습니다.',
  },
  SERVER_ERROR: {
    statusCode: 500,
    defaultMessage: '서버 오류입니다.',
  },
  NETWORK_ERROR: {
    statusCode: undefined,
    defaultMessage: '네트워크 요청이 실패하였습니다.',
  },
  TOKEN_EXPIRED: {
    statusCode: 401,
    defaultMessage: '토큰이 만료되었습니다.',
  },
  VALIDATION_ERROR: {
    statusCode: 422,
    defaultMessage: '유효성 검증에 실패하였습니다.',
  },
  UNKNOWN_ERROR: {
    statusCode: undefined,
    defaultMessage: '알 수 없는 오류입니다.',
  },
} as const;