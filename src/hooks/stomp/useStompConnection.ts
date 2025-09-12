import type { StompConnectionReturn } from "@/hooks/stomp/types";
import { useStompContext } from "@/hooks/stomp/useStompContext";

export const useStompConnection = (): StompConnectionReturn => {
  const { client, isConnected, isConnecting, error } = useStompContext();
  return { client, isConnected, isConnecting, error };
};
