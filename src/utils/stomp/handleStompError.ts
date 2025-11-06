import { StompErrorFactory } from "@/errors/stomp-error-factory";
import type { IMessage } from "@stomp/stompjs";

import { getMessageBody } from "./getMessageBody";

export const handleStompError = (message: IMessage): void => {
  const response = getMessageBody<BaseErrorResponse>(message);

  if (!response) {
    console.error("에러 메시지 파싱 실패:", message.body);
    return;
  }

  const stompError = StompErrorFactory.fromBackendErrorResponse(response);

  console.error("백엔드 에러 수신:", {
    code: stompError.code,
    message: stompError.message,
    metadata: stompError.metadata,
  });

  // TODO : 에러를 토스트같은 UI로 표시해주기
};
