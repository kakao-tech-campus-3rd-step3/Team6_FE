import { useStompContext } from "@/context/useStompContext";
import type { StompPublishOptions, StompPublishReturn } from "@/hooks/stomp/types";
import { useCallback } from "react";

import { useStompConnection } from "./useStompConnection";

export const useStompPublish = (): StompPublishReturn => {
  const { isConnected, error } = useStompConnection();
  const stompService = useStompContext();

  const publish = useCallback(
    async (destination: string, body: unknown, options: StompPublishOptions = {}): Promise<boolean> => {
      return stompService.publish(destination, body, options);
    },
    [stompService],
  );

  return { publish, isConnected, error };
};
