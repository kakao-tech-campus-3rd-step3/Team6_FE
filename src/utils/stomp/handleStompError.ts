import { StompErrorFactory } from "@/errors/stomp-error-factory";
import type { IMessage } from "@stomp/stompjs";

export const handleStompError = (message: IMessage): void => {
  try {
    const response = JSON.parse(message.body);
    const stompError = StompErrorFactory.fromBackendErrorResponse(response);

    console.error("백엔드 에러 수신:", {
      code: stompError.code,
      message: stompError.message,
      metadata: stompError.metadata,
    });

    // TODO : 에러를 토스트같은 UI로 표시해주기
  } catch (error) {
    console.error("에러 메시지 파싱 실패:", error);
  }
};
