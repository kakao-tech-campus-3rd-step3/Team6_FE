import type { StateListener, StompState, Unsubscribe } from "@/services/stomp/types";
import { useAuthStore } from "@/store/authStore";
import { Client, type IFrame, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class StompService {
  private static instance: StompService;

  private client: Client | null = null;
  private state: StompState = {
    isConnected: false,
    isConnecting: false,
    error: null,
  };

  private stateListeners = new Set<StateListener>();
  private messageHandlers = new Map<string, Map<string, (message: IMessage) => void>>();
  private stompSubscriptions = new Map<string, StompSubscription>();

  public static getInstance(): StompService {
    if (!StompService.instance) {
      StompService.instance = new StompService();
    }
    return StompService.instance;
  }

  private setState(newState: Partial<StompState>) {
    this.state = { ...this.state, ...newState };
    this.notifyStateListeners();
  }

  private notifyStateListeners() {
    this.stateListeners.forEach((listener) => listener(this.state));
  }

  public subscribeToState(listener: StateListener): Unsubscribe {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  public getState(): StompState {
    return this.state;
  }

  public initialize(brokerURL: string, token: string | null) {
    if (this.client && this.client.active) {
      this.deactivate();
    }

    if (!token) {
      this.setState({ isConnected: false, isConnecting: false, error: "인증 토큰이 없어 소켓 연결 생략" });
      this.client = null;
      return;
    }

    this.client = new Client({
      webSocketFactory: () => {
        const httpUrl = brokerURL.replace("ws://", "http://").replace("wss://", "https://");
        return new SockJS(httpUrl);
      },
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log("STOMP Debug:", str),
      onConnect: () => {
        this.setState({ isConnected: true, isConnecting: false, error: null });
        console.log("STOMP 연결 성공");
      },
      onDisconnect: () => {
        this.setState({ isConnected: false, isConnecting: false });
        console.log("STOMP 연결 해제");
      },
      onStompError: (frame: IFrame) => {
        const error = frame.body || frame.headers?.message || "STOMP 프로토콜 에러";
        this.setState({ isConnected: false, isConnecting: false, error });
        console.error("STOMP 에러:", error, frame);
      },
      onWebSocketError: (event) => {
        this.setState({ isConnected: false, isConnecting: false, error: "웹소켓 연결 오류" });
        console.error("웹소켓 에러:", event);
      },
      onWebSocketClose: (event) => {
        this.setState({ isConnected: false });
        if (!event.wasClean) {
          this.setState({ isConnecting: true, error: "웹소켓 연결이 예기치 않게 종료됨" });
        }
        console.log("웹소켓 연결 종료", event);
      },
    });
  }

  public activate() {
    if (this.client && !this.client.active && !this.client.connected) {
      this.setState({ isConnecting: true, error: null });
      try {
        this.client.activate();
      } catch (err) {
        const error = err instanceof Error ? err.message : "STOMP 활성화 실패";
        this.setState({ isConnecting: false, error });
        console.error("STOMP 활성화 실패:", err);
      }
    }
  }

  public deactivate() {
    if (this.client?.active) {
      try {
        this.client.deactivate();
        this.messageHandlers.clear();
        this.stompSubscriptions.clear();
        this.setState({ isConnected: false, isConnecting: false, error: null });
        console.log("STOMP 연결 해제됨");
      } catch (err) {
        console.error("STOMP 해제 실패:", err);
      }
    }
  }

  public publish(
    destination: string,
    body: unknown,
    options: { headers?: Record<string, string>; skipContentLengthHeader?: boolean } = {},
  ): boolean {
    if (!this.client || !this.state.isConnected) {
      console.error("STOMP 클라이언트가 연결되지 않았습니다. 메시지 발행 실패.");
      return false;
    }

    try {
      const token = useAuthStore.getState().token;
      const headers: Record<string, string> = { ...(options.headers ?? {}) };

      const hasAuthHeader = Object.keys(headers).some((k) => k.toLowerCase() === "authorization");
      if (token && !hasAuthHeader) {
        headers.Authorization = `Bearer ${token}`;
      }

      const isObjectBody = typeof body === "object" && body !== null;
      const hasContentType = Object.keys(headers).some((k) => k.toLowerCase() === "content-type");
      if (isObjectBody && !hasContentType) {
        headers["content-type"] = "application/json";
      }

      this.client.publish({
        destination,
        body: isObjectBody ? JSON.stringify(body) : String(body),
        headers,
        skipContentLengthHeader: options.skipContentLengthHeader,
      });

      console.log(`메시지 발송 성공: ${destination}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "메시지 발송 중 오류가 발생했습니다";
      console.error(`메시지 발송 실패: ${destination}`, errorMessage);
      return false;
    }
  }

  public subscribe(destination: string, callback: (message: IMessage) => void): Unsubscribe {
    const subscriptionId = `sub-${Date.now()}-${Math.random()}`;

    if (!this.messageHandlers.has(destination)) {
      this.messageHandlers.set(destination, new Map());
    }
    this.messageHandlers.get(destination)!.set(subscriptionId, callback);

    if (!this.stompSubscriptions.has(destination)) {
      if (this.client && this.state.isConnected) {
        const subscription = this.client.subscribe(destination, (message: IMessage) => {
          this.messageHandlers.get(destination)?.forEach((handler) => {
            try {
              handler(message);
            } catch (err) {
              console.error(`메시지 핸들러 오류 [${destination}]:`, err);
            }
          });
        });
        this.stompSubscriptions.set(destination, subscription);
      } else {
        console.warn(`STOMP 클라이언트가 연결되지 않아 [${destination}] 구독을 지연합니다.`);
      }
    }

    return () => {
      const handlers = this.messageHandlers.get(destination);
      if (handlers) {
        handlers.delete(subscriptionId);
        if (handlers.size === 0) {
          this.messageHandlers.delete(destination);
          this.stompSubscriptions.get(destination)?.unsubscribe();
          this.stompSubscriptions.delete(destination);
          console.log(`STOMP 구독 해제: ${destination}`);
        }
      }
    };
  }
}

export const stompService = StompService.getInstance();
