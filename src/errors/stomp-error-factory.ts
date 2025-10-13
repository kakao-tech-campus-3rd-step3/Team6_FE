import { STOMP_ERROR_CONFIGS } from "@/constants/stomp-error-configs";
import { StompError } from "@/errors/stomp-errors";
import type { StompErrorCode } from "@/errors/types";
import type { IFrame } from "@stomp/stompjs";

export class StompErrorFactory {
  static create(code: StompErrorCode, message?: string, metadata?: Record<string, unknown>): StompError {
    const config = STOMP_ERROR_CONFIGS[code] ?? STOMP_ERROR_CONFIGS.STOMP_UNKNOWN_ERROR;
    return new StompError({
      code,
      message: message || config.defaultMessage,
      metadata,
    });
  }

  static fromStompFrame(frame: IFrame, code?: StompErrorCode): StompError {
    const errorMessage = frame.body || frame.headers?.message || "STOMP 프로토콜 에러";
    const metadata = {
      command: frame.command,
      headers: frame.headers,
      body: frame.body,
    };

    if (code) {
      return this.create(code, errorMessage, metadata);
    }

    if (frame.headers?.message?.includes("auth") || frame.headers?.message?.includes("unauthorized")) {
      return this.create("STOMP_UNAUTHORIZED", errorMessage, metadata);
    }

    return this.create("STOMP_PROTOCOL_ERROR", errorMessage, metadata);
  }

  static fromWebSocketError(event: Event, code: StompErrorCode = "STOMP_WEBSOCKET_ERROR"): StompError {
    return this.create(code, undefined, {
      event: event.type,
      timestamp: Date.now(),
    });
  }

  static fromWebSocketClose(event: CloseEvent, code: StompErrorCode = "STOMP_WEBSOCKET_CLOSE"): StompError {
    const message = event.wasClean
      ? "웹소켓 연결이 정상적으로 종료되었습니다"
      : "웹소켓 연결이 예기치 않게 종료되었습니다";

    return this.create(code, message, {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
      timestamp: Date.now(),
    });
  }

  static fromConnectionError(error: Error | unknown, code: StompErrorCode = "STOMP_CONNECTION_FAILED"): StompError {
    const message = error instanceof Error ? error.message : undefined;
    return this.create(code, message, {
      originalError: error instanceof Error ? error.stack : String(error),
    });
  }

  static fromActivationError(error: Error | unknown, code: StompErrorCode = "STOMP_ACTIVATION_FAILED"): StompError {
    const message = error instanceof Error ? error.message : undefined;
    return this.create(code, message, {
      originalError: error instanceof Error ? error.stack : String(error),
    });
  }

  static fromSubscriptionError(
    destination: string,
    error?: Error | unknown,
    code: StompErrorCode = "STOMP_SUBSCRIPTION_FAILED",
  ): StompError {
    const message = error instanceof Error ? error.message : `[${destination}] 구독 실패`;
    return this.create(code, message, {
      destination,
      originalError: error instanceof Error ? error.stack : String(error),
    });
  }

  static fromPublishError(
    destination: string,
    error?: Error | unknown,
    code: StompErrorCode = "STOMP_PUBLISH_FAILED",
  ): StompError {
    const message = error instanceof Error ? error.message : `[${destination}] 메시지 발송 실패`;
    return this.create(code, message, {
      destination,
      originalError: error instanceof Error ? error.stack : String(error),
    });
  }

  static fromMessageParseError(
    error: Error | unknown,
    rawMessage?: string,
    code: StompErrorCode = "STOMP_MESSAGE_PARSE_ERROR",
  ): StompError {
    const message = error instanceof Error ? error.message : undefined;
    return this.create(code, message, {
      rawMessage,
      originalError: error instanceof Error ? error.stack : String(error),
    });
  }

  static noToken(): StompError {
    return this.create("STOMP_NO_TOKEN");
  }

  static notConnected(): StompError {
    return this.create("STOMP_NOT_CONNECTED");
  }

  static fromBackendErrorResponse(response: unknown): StompError {
    try {
      const errorResponse = response as {
        status?: string;
        error?: {
          code?: string;
          message?: string;
        };
      };

      if (errorResponse.status === "ERROR" && errorResponse.error?.code) {
        const code = errorResponse.error.code as StompErrorCode;
        const message = errorResponse.error.message;

        return this.create(code, message, {
          backendError: errorResponse.error,
        });
      }

      return this.create("STOMP_UNKNOWN_ERROR", "알 수 없는 서버 에러", {
        rawResponse: response,
      });
    } catch (error) {
      return this.create("STOMP_UNKNOWN_ERROR", "에러 응답 파싱 실패", {
        rawResponse: response,
        parseError: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
