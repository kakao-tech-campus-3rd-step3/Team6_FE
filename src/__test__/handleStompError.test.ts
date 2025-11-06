import type { StompErrorResponse } from "@/errors/types";
import { handleStompError } from "@/utils/stomp/handleStompError";
import type { IMessage } from "@stomp/stompjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("handleStompError", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("메시지 파싱 및 로깅", () => {
    it("IMessage를 파싱하고 백엔드 에러를 로깅해야 한다", () => {
      const errorResponse: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        },
      };

      const message: IMessage = {
        body: JSON.stringify(errorResponse),
      } as IMessage;

      handleStompError(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "백엔드 에러 수신:",
        expect.objectContaining({
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
          metadata: expect.any(Object),
        }),
      );
    });

    it("다양한 에러 코드를 처리하고 로깅해야 한다", () => {
      const errorResponse: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "ROOM_CAPACITY_EXCEEDED",
          message: "방 정원을 초과했습니다.",
        },
      };

      const message: IMessage = {
        body: JSON.stringify(errorResponse),
      } as IMessage;

      handleStompError(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "백엔드 에러 수신:",
        expect.objectContaining({
          code: "ROOM_CAPACITY_EXCEEDED",
          message: "방 정원을 초과했습니다.",
        }),
      );
    });
  });

  describe("JSON 파싱 실패", () => {
    it("잘못된 JSON 형식이면 파싱 실패 에러를 로깅해야 한다", () => {
      const message: IMessage = {
        body: "invalid json",
      } as IMessage;

      handleStompError(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith("에러 메시지 파싱 실패:", "invalid json");
    });

    it("빈 문자열이면 파싱 실패 에러를 로깅해야 한다", () => {
      const message: IMessage = {
        body: "",
      } as IMessage;

      handleStompError(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith("에러 메시지 파싱 실패:", "");
    });
  });

  describe("예외 처리", () => {
    it("정상 메시지 처리 중 예외가 발생하지 않아야 한다", () => {
      const errorResponse: StompErrorResponse = {
        status: "ERROR",
        data: null,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "서버 내부 오류가 발생했습니다.",
        },
      };

      const message: IMessage = {
        body: JSON.stringify(errorResponse),
      } as IMessage;

      expect(() => {
        handleStompError(message);
      }).not.toThrow();
    });

    it("잘못된 메시지 처리 중에도 예외가 발생하지 않아야 한다", () => {
      const message: IMessage = {
        body: "invalid json",
      } as IMessage;

      expect(() => {
        handleStompError(message);
      }).not.toThrow();
    });

    it("null body 처리 중에도 예외가 발생하지 않아야 한다", () => {
      const message: IMessage = {
        body: null as unknown as string,
      } as IMessage;

      expect(() => {
        handleStompError(message);
      }).not.toThrow();
    });
  });
});
