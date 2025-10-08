import { useStompSubscription } from "@/hooks/stomp";
import { stompService } from "@/services/stomp/StompService";
import { handleStompError } from "@/utils/stomp/handleStompError";
import { type ReactNode, useEffect } from "react";

export interface StompProviderProps {
  brokerURL: string;
  children: ReactNode;
  token: string | null;
}

export const StompProvider = ({ brokerURL, children, token }: StompProviderProps) => {
  useEffect(() => {
    stompService.initialize(brokerURL, token);
    stompService.activate();

    return () => {
      stompService.deactivate();
    };
  }, [brokerURL, token]);

  useStompSubscription("/user/queue/errors", handleStompError);

  return <>{children}</>;
};
