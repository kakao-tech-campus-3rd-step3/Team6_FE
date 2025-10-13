import { stompService } from "@/services/stomp/StompService";
import { type IMessage } from "@stomp/stompjs";
import { useEffect, useRef } from "react";

import type { StompSubscriptionReturn } from "./types";
import { useStompConnection } from "./useStompConnection";

export const useStompSubscription = (
  destination: string | null,
  onMessage: (message: IMessage) => void,
): StompSubscriptionReturn => {
  const { isConnected } = useStompConnection();
  const savedOnMessage = useRef(onMessage);

  useEffect(() => {
    savedOnMessage.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!destination || !isConnected) {
      return;
    }

    const messageCallback = (message: IMessage) => {
      savedOnMessage.current(message);
    };

    const unsubscribe = stompService.subscribe(destination, messageCallback);

    return () => {
      unsubscribe();
    };
  }, [destination, isConnected]);
};
