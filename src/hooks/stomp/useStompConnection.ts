import { stompService } from "@/services/stomp/StompService";
import type { StompState } from "@/services/stomp/types";
import { useEffect, useState } from "react";

export const useStompConnection = (): StompState => {
  const [stompState, setStompState] = useState<StompState>(stompService.getState());

  useEffect(() => {
    const unsubscribe = stompService.subscribeToState(setStompState);
    return unsubscribe;
  }, []);

  return stompState;
};
