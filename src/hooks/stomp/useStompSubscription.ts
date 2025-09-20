import type { StompSubscriptionOptions, StompSubscriptionReturn } from "@/hooks/stomp/types";
import { useAuthStore } from "@/store/authStore";
import { useSubscriptionStore } from "@/store/subscriptionManager";
import { type IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useRef } from "react";

import { subscriptionManager } from "./StompSubscriptionManager";
import { useStompConnection } from "./useStompConnection";

const globalMessageHandlers = new Map<string, Map<string, (message: IMessage) => void>>();

export const useStompSubscription = (
  destination: string | null,
  onMessage: (message: IMessage) => void,
  options: StompSubscriptionOptions = {},
): StompSubscriptionReturn => {
  const { client, isConnected } = useStompConnection();
  const token = useAuthStore((state) => state.token);
  const { addTopic, removeTopic, isSubscribed: isTopicSubscribed } = useSubscriptionStore();

  const instanceId = useRef(`sub-${Date.now()}-${Math.random()}`);
  const savedOnMessage = useRef(onMessage);

  useEffect(() => {
    savedOnMessage.current = onMessage;
  }, [onMessage]);

  const handleUnsubscribe = useCallback(() => {
    if (!destination) return;

    const handlers = globalMessageHandlers.get(destination);
    if (!handlers) return;

    handlers.delete(instanceId.current);

    if (handlers.size === 0) {
      globalMessageHandlers.delete(destination);
      const subscription = subscriptionManager.removeSubscription(destination);
      removeTopic(destination);

      subscription?.unsubscribe();
    }
  }, [destination, removeTopic]);

  const createSubscription = useCallback(() => {
    if (!client || !destination || !isConnected) return;

    const subscribeHeaders: Record<string, string> = { ...options.headers };
    if (token && !subscribeHeaders.Authorization) {
      subscribeHeaders.Authorization = `Bearer ${token}`;
    }

    const subscription = client.subscribe(
      destination,
      (message: IMessage) => {
        const handlers = globalMessageHandlers.get(destination);
        handlers?.forEach((handler) => {
          try {
            handler(message);
          } catch (err) {
            console.error(`메시지 핸들러 오류:`, err);
          }
        });
      },
      subscribeHeaders,
    );

    subscriptionManager.addSubscription(destination, subscription);
    addTopic(destination);
  }, [client, destination, isConnected, token, options.headers, addTopic]);

  useEffect(() => {
    if (!destination || !isConnected || !client) return;

    if (!globalMessageHandlers.has(destination)) {
      globalMessageHandlers.set(destination, new Map());
    }

    const handlers = globalMessageHandlers.get(destination)!;
    handlers.set(instanceId.current, savedOnMessage.current);

    if (!subscriptionManager.isSubscribed(destination)) {
      createSubscription();
    }

    return handleUnsubscribe;
  }, [destination, isConnected, client, createSubscription, handleUnsubscribe]);

  return {
    isSubscribed: destination ? isTopicSubscribed(destination) : false,
    error: null,
  };
};
