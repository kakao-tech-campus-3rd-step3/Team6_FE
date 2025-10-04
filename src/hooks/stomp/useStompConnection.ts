import { stompService } from "@/services/stomp/StompService";
import type { StompState } from "@/services/stomp/types";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

let globalUnsubscribe: (() => void) | null = null;
let subscriberCount = 0;
const stateSetters = new Set<Dispatch<SetStateAction<StompState>>>();

const ensureGlobalListener = () => {
  if (!globalUnsubscribe && subscriberCount > 0) {
    globalUnsubscribe = stompService.subscribeToState((state) => {
      stateSetters.forEach((setter) => setter(state));
    });
  }
};

const cleanupGlobalListener = () => {
  if (subscriberCount === 0 && globalUnsubscribe) {
    globalUnsubscribe();
    globalUnsubscribe = null;
  }
};

export const useStompConnection = (): StompState => {
  const [state, setState] = useState<StompState>(stompService.getState());

  useEffect(() => {
    subscriberCount++;
    stateSetters.add(setState);
    ensureGlobalListener();

    return () => {
      stateSetters.delete(setState);
      subscriberCount--;
      cleanupGlobalListener();
    };
  }, []);

  return state;
};
