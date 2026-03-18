import { useStompContext } from "@/context/useStompContext";
import { type IMessage } from "@stomp/stompjs";
import { useEffect, useRef } from "react";

import type { StompSubscriptionReturn } from "./types";
import { useStompConnection } from "./useStompConnection";

export const useStompSubscription = <T = unknown>(
  destination: string | null,
  onMessage: (body: T, message: IMessage) => void,
): StompSubscriptionReturn => {
  const stompService = useStompContext();
  const { isConnected } = useStompConnection();
  const savedOnMessage = useRef(onMessage);

  useEffect(() => {
    savedOnMessage.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!destination || !isConnected) {
      return;
    }

    const messageCallback = (body: T, message: IMessage) => {
      savedOnMessage.current(body, message);
    };

    const unsubscribe = stompService.subscribe<T>(destination, messageCallback);

    return () => {
      unsubscribe();
    };
  }, [destination, isConnected, stompService]);
};
