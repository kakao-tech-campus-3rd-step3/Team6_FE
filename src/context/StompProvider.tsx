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

  return <>{children}</>;
};
