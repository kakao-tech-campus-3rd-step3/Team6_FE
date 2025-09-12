import type { StompSubscriptionOptions, StompSubscriptionReturn } from "@/hooks/stomp/types";
import { useAuthStore } from "@/store/authStore";
import { type IMessage, type StompSubscription } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";

import { useStompConnection } from "./useStompConnection";

export const useStompSubscription = (
  destination: string | null,
  onMessage: (message: IMessage) => void,
  options: StompSubscriptionOptions = {},
): StompSubscriptionReturn => {
  const { client, isConnected } = useStompConnection();
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);

  const savedOnMessage = useRef(onMessage);
  useEffect(() => {
    savedOnMessage.current = onMessage;
  }, [onMessage]);

  const unsubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
        console.log(`구독 해제 성공: ${subscriptionRef.current.id} -> ${destination}`);
        subscriptionRef.current = null;
        setIsSubscribed(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "구독 해제 중 오류가 발생했습니다";
        console.error(`구독 해제 실패: ${destination}`, err);
        setError(errorMessage);
      }
    }
  }, [destination]);

  useEffect(() => {
    if (!isConnected || !client || !destination) {
      unsubscribe();
      setIsSubscribed(false);
      return;
    }

    try {
      const subscribeHeaders: Record<string, string> = { ...options.headers };

      if (token && !subscribeHeaders.Authorization) {
        subscribeHeaders.Authorization = `Bearer ${token}`;
      }

      if (options.id) subscribeHeaders.id = options.id;
      if (options.ack) subscribeHeaders.ack = options.ack;

      if (process.env.NODE_ENV === 'development') {
        const safeHeaders = { ...subscribeHeaders };
        if (safeHeaders.Authorization) {
          safeHeaders.Authorization = '[REDACTED]';
        }
        console.log(`구독 시도: ${destination}`, { headers: safeHeaders });
      }

      const subscription = client.subscribe(
        destination,
        (message: IMessage) => {
          savedOnMessage.current(message);
        },
        subscribeHeaders,
      );

      subscriptionRef.current = subscription;
      setIsSubscribed(true);
      setError(null);
      console.log(`구독 성공: ${subscription.id} -> ${destination}`);

      return () => {
        unsubscribe();
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "구독 중 오류가 발생했습니다";
      console.error(`구독 실패: ${destination}`, err);
      setError(errorMessage);
      setIsSubscribed(false);
    }
  }, [client, isConnected, destination, options, unsubscribe, token]);

  return { isSubscribed, error };
};
