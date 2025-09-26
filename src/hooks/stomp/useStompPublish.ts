import type { StompPublishOptions, StompPublishReturn } from "@/hooks/stomp/types";
import { stompService } from "@/services/stomp/StompService";
import { useCallback } from "react";

import { useStompConnection } from "./useStompConnection";

export const useStompPublish = (): StompPublishReturn => {
  const { isConnected, error } = useStompConnection();

  const publish = useCallback(
    async (destination: string, body: unknown, options: StompPublishOptions = {}): Promise<boolean> => {
      return stompService.publish(destination, body, options);
    },
    [],
  );

  return { publish, isConnected, error };
};
