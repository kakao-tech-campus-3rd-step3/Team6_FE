import { useStompSubscription } from "@/hooks/stomp";
import { stompService } from "@/services/stomp/StompService";
import type { IMessage } from "@stomp/stompjs";
import { type ReactNode, useCallback, useEffect } from "react";

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

  const handleGlobalError = useCallback((message: IMessage) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const error = JSON.parse(message.body);
      // TODO : 에러를 토스트같은 UI로 표시해주기
    } catch {
      //
    }
  }, []);

  useStompSubscription("/user/queue/errors", handleGlobalError);

  return <>{children}</>;
};
