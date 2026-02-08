import { useStompContext } from "@/context/useStompContext";
import type { StompState } from "@/services/stomp/types";
import { useEffect, useState } from "react";

export const useStompConnection = (): StompState => {
  const stompService = useStompContext();
  const [state, setState] = useState<StompState>(stompService.getState());

  useEffect(() => {
    const unsubscribe = stompService.subscribeToState(setState);
    return () => {
      unsubscribe();
    };
  }, [stompService]);

  return state;
};
