import type { IMessage } from "@stomp/stompjs";

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
