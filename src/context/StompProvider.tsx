import { useStompSubscription } from "@/hooks/stomp";
import { stompService } from "@/services/stomp/StompService";
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

  const handleGlobalError = () => {
    try {
      // TODO : 에러를 토스트같은 UI로 표시해주기
    } catch {
      //
    }
  };

  useStompSubscription("/user/queue/errors", handleGlobalError);

  return <>{children}</>;
};
