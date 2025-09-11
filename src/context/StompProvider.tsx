import { Client, type IFrame } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";

import { StompContext, type StompProviderProps } from "./StompContext";

export const StompProvider = ({ brokerURL, children, token }: StompProviderProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    console.log("STOMP Provider 초기화:", { brokerURL, token: token ? "EXISTS" : "NULL" });

    const client = new Client({
      webSocketFactory: () => {
        const httpUrl = brokerURL.replace("ws://", "http://").replace("wss://", "https://");
        console.log("SockJS URL:", httpUrl);
        return new SockJS(httpUrl);
      },

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      debug: (str) => {
        console.log("STOMP Debug:", str);
      },

      onConnect: (frame: IFrame) => {
        console.log("STOMP 연결 성공", frame);
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        setReconnectAttempts(0);
      },

      onDisconnect: (frame: IFrame) => {
        console.log("STOMP 연결 해제", frame);
        setIsConnected(false);
        setIsConnecting(false);
      },

      onStompError: (frame: IFrame) => {
        const errorMessage = frame.body || frame.headers?.message || "STOMP 프로토콜 에러가 발생했습니다";
        console.error("STOMP 에러:", errorMessage, frame);
        setError(errorMessage);
        setIsConnected(false);
        setIsConnecting(false);
      },

      onWebSocketError: (event) => {
        console.error("웹소켓 에러:", event);
        setError("웹소켓 연결 오류가 발생했습니다");
        setIsConnected(false);
        setIsConnecting(false);
      },

      onWebSocketClose: (event) => {
        console.log("웹소켓 연결 종료", event);
        setIsConnected(false);

        if (event && !event.wasClean) {
          setError("웹소켓 연결이 예기치 않게 종료되었습니다");
          setReconnectAttempts((prev) => prev + 1);
          setIsConnecting(true);
        }
      },
    });

    setClient(client);
    setIsConnecting(true);
    setError(null);

    try {
      client.activate();
    } catch (err) {
      console.error("STOMP 활성화 실패:", err);
      setError(err instanceof Error ? err.message : "STOMP 활성화 실패");
      setIsConnecting(false);
    }

    return () => {
      if (client.active) {
        console.log("STOMP 연결 해제 시도");
        try {
          client.deactivate();
          console.log("STOMP 연결 해제됨");
        } catch (err) {
          console.error("STOMP 해제 실패:", err);
        }
      }
    };
  }, [brokerURL, token]);

  return (
    <StompContext.Provider value={{ client, isConnected, isConnecting, error, reconnectAttempts }}>
      {children}
    </StompContext.Provider>
  );
};
