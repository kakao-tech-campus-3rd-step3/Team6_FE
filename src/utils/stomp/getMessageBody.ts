import type { IMessage } from "@stomp/stompjs";

/**
 * @warning 이 함수는 런타임 타입 검증을 수행하지 않습니다.
 * 추후 zod 스키마 방식을 적용해야합니다.
 * @template T - 파싱 결과로 기대하는 타입
 * @param message - STOMP 메시지 객체
 * @returns 파싱된 데이터 또는 실패 시 null
 */
export const getMessageBody = <T>(message: IMessage): T | null => {
  try {
    if (!message?.body) {
      return null;
    }
    return JSON.parse(message.body) as T;
  } catch (e) {
    console.error(e);
    return null;
  }
};
