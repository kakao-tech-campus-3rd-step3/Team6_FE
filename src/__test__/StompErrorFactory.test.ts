import { StompErrorFactory } from "@/errors/stomp-error-factory";
import type { StompErrorResponse } from "@/errors/types";
import { beforeEach, describe, expect, it } from "vitest";

describe("StompErrorFactory - 백엔드 에러 응답", () => {
  beforeEach(() => {});

  describe("fromBackendErrorResponse", () => {
    it("유효한 백엔드 에러 응답을 파싱해야 한다", () => {
      const response: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        },
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("USER_NOT_FOUND");
      expect(stompError.message).toBe("사용자를 찾을 수 없습니다.");
      expect(stompError.metadata?.backendError).toEqual(response.error);
    });

    it("ROOM_NOT_FOUND 에러를 처리해야 한다", () => {
      const response: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "ROOM_NOT_FOUND",
          message: "방을 찾을 수 없습니다.",
        },
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("ROOM_NOT_FOUND");
      expect(stompError.message).toBe("방을 찾을 수 없습니다.");
    });

    it("USER_NOT_AUTHENTICATED 에러를 처리해야 한다", () => {
      const response: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "USER_NOT_AUTHENTICATED",
          message: "사용자가 인증되지 않았습니다.",
        },
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("USER_NOT_AUTHENTICATED");
      expect(stompError.message).toBe("사용자가 인증되지 않았습니다.");
    });

    it("ROOM_CAPACITY_EXCEEDED 에러를 처리해야 한다", () => {
      const response: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "ROOM_CAPACITY_EXCEEDED",
          message: "방 정원을 초과했습니다.",
        },
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("ROOM_CAPACITY_EXCEEDED");
      expect(stompError.message).toBe("방 정원을 초과했습니다.");
    });

    it("INVALID_STAGE_TRANSITION 에러를 처리해야 한다", () => {
      const response: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "INVALID_STAGE_TRANSITION",
          message: "유효하지 않은 스테이지 전환입니다.",
        },
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("INVALID_STAGE_TRANSITION");
      expect(stompError.message).toBe("유효하지 않은 스테이지 전환입니다.");
    });

    it("EXPIRED_JWT_TOKEN 에러를 처리해야 한다", () => {
      const response: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "EXPIRED_JWT_TOKEN",
          message: "만료된 JWT 토큰입니다.",
        },
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("EXPIRED_JWT_TOKEN");
      expect(stompError.message).toBe("만료된 JWT 토큰입니다.");
    });

    it("status가 ERROR가 아니면 STOMP_UNKNOWN_ERROR를 반환해야 한다", () => {
      const response = {
        status: "SUCCESS",
        data: { foo: "bar" },
        error: null,
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("STOMP_UNKNOWN_ERROR");
      expect(stompError.message).toBe("알 수 없는 서버 에러");
      expect(stompError.metadata?.rawResponse).toEqual(response);
    });

    it("error.code가 없으면 STOMP_UNKNOWN_ERROR를 반환해야 한다", () => {
      const response = {
        status: "ERROR",
        data: null,
        error: {
          message: "에러 발생",
        },
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("STOMP_UNKNOWN_ERROR");
      expect(stompError.message).toBe("알 수 없는 서버 에러");
    });

    it("잘못된 형식의 응답이면 STOMP_UNKNOWN_ERROR를 반환해야 한다", () => {
      const response = "invalid response";

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("STOMP_UNKNOWN_ERROR");
      expect(stompError.message).toBe("알 수 없는 서버 에러");
      expect(stompError.metadata?.rawResponse).toBe(response);
    });

    it("null 응답이면 STOMP_UNKNOWN_ERROR를 반환해야 한다", () => {
      const response = null;

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("STOMP_UNKNOWN_ERROR");
      expect(stompError.message).toBe("에러 응답 파싱 실패");
      expect(stompError.metadata?.rawResponse).toBeNull();
    });

    it("undefined 응답이면 STOMP_UNKNOWN_ERROR를 반환해야 한다", () => {
      const response = undefined;

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("STOMP_UNKNOWN_ERROR");
      expect(stompError.message).toBe("에러 응답 파싱 실패");
      expect(stompError.metadata?.rawResponse).toBeUndefined();
    });

    it("빈 객체 응답이면 STOMP_UNKNOWN_ERROR를 반환해야 한다", () => {
      const response = {};

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe("STOMP_UNKNOWN_ERROR");
      expect(stompError.message).toBe("알 수 없는 서버 에러");
    });

    it("백엔드 에러 메타데이터를 포함해야 한다", () => {
      const response: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "서버 내부 오류가 발생했습니다.",
        },
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.metadata).toHaveProperty("backendError");
      expect(stompError.metadata?.backendError).toEqual({
        code: "INTERNAL_SERVER_ERROR",
        message: "서버 내부 오류가 발생했습니다.",
      });
    });
  });

  describe("백엔드 에러 코드별 테스트", () => {
    const backendErrorCodes = [
      "INTERNAL_SERVER_ERROR",
      "USER_NOT_FOUND",
      "INVALID_MBTI_TYPE",
      "USER_NOT_AUTHENTICATED",
      "ROOM_NOT_FOUND",
      "ROOM_ALREADY_EXISTS",
      "WAITING_ROOM_NOT_FOUND",
      "WAITING_ROOM_FULL",
      "ALREADY_ROOM_JOIN",
      "ROOM_CAPACITY_EXCEEDED",
      "INVALID_STAGE_VALUE",
      "USER_NOT_IN_ROOM",
      "INVALID_STAGE_EVENT_VALUE",
      "INVALID_STAGE_TRANSITION",
      "ROOM_STAGE_NOT_FOUND",
      "ROOM_OWNER_NOT_FOUND",
      "ROOM_OWNER_MISMATCH",
      "INVALID_ROOM_STAGE",
      "ROOM_STAGE_NOT_INITIALIZED",
      "INIT_STAGE_EVENT_NOT_ALLOWED",
      "QUESTION_NOT_FOUND",
      "INVALID_QUESTION_TYPE",
      "INVALID_INTEREST_TYPE",
      "INVALID_GAME_CATEGORY",
      "INVALID_JWT_PAYLOAD",
      "EXPIRED_JWT_TOKEN",
      "INVALID_JWT_TOKEN",
      "INVALID_JWT_SIGNATURE",
      "INVALID_REQUEST",
    ] as const;

    it.each(backendErrorCodes)("%s 에러 코드를 처리할 수 있어야 한다", (errorCode) => {
      const response: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: errorCode,
          message: `${errorCode} 에러 메시지`,
        },
      };

      const stompError = StompErrorFactory.fromBackendErrorResponse(response);

      expect(stompError.code).toBe(errorCode);
      expect(stompError.message).toBe(`${errorCode} 에러 메시지`);
    });
  });
});
