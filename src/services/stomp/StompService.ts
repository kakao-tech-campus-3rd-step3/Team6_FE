import { StompErrorFactory } from "@/errors/stomp-error-factory";
import type { StateListener, StompState, Unsubscribe } from "@/services/stomp/types";
import { useAuthStore } from "@/store/authStore";
import { Client, type IFrame, type IMessage, type StompSubscription } from "@stomp/stompjs";

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
      this.setState({ isConnected: false, isConnecting: false, error: StompErrorFactory.noToken() });
      this.client = null;
      return;
    }

    this.client = new Client({
      brokerURL,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.setState({ isConnected: true, isConnecting: false, error: null });
      },
      onDisconnect: () => {
        this.setState({ isConnected: false, isConnecting: false });
      },
      onStompError: (frame: IFrame) => {
        const error = StompErrorFactory.fromStompFrame(frame);
        this.setState({ isConnected: false, isConnecting: false, error });
      },
      onWebSocketError: (event) => {
        const error = StompErrorFactory.fromWebSocketError(event);
        this.setState({ isConnected: false, isConnecting: false, error });
      },
      onWebSocketClose: (event) => {
        this.setState({ isConnected: false });
        if (!event.wasClean) {
          const error = StompErrorFactory.fromWebSocketClose(event);
          this.setState({ isConnecting: true, error });
        }
      },
    });
  }

  public activate() {
    if (this.client && !this.client.active && !this.client.connected) {
      this.setState({ isConnecting: true, error: null });
      try {
        this.client.activate();
      } catch (err) {
        const error = StompErrorFactory.fromActivationError(err);
        this.setState({ isConnecting: false, error });
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
      } catch (err) {
        const error = StompErrorFactory.fromConnectionError(err);
        this.setState({ error });
      }
    }
  }

  public publish(
    destination: string,
    body: unknown,
    options: { headers?: Record<string, string>; skipContentLengthHeader?: boolean } = {},
  ): boolean {
    if (!this.client || !this.state.isConnected) {
      this.setState({ error: StompErrorFactory.notConnected() });
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

      return true;
    } catch (err) {
      const error = StompErrorFactory.fromPublishError(destination, err);
      this.setState({ error });
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
        try {
          const subscription = this.client.subscribe(destination, (message: IMessage) => {
            this.messageHandlers.get(destination)?.forEach((handler) => {
              try {
                handler(message);
              } catch (err) {
                const error = StompErrorFactory.fromMessageParseError(err, message.body);
                this.setState({ error });
              }
            });
          });
          this.stompSubscriptions.set(destination, subscription);
        } catch (err) {
          const error = StompErrorFactory.fromSubscriptionError(destination, err);
          this.setState({ error });
        }
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
        }
      }
    };
  }

  public getDebugInfo() {
    if (import.meta.env.DEV) {
      return {
        messageHandlersSize: this.messageHandlers.size,
        stompSubscriptionsSize: this.stompSubscriptions.size,
        stateListenersSize: this.stateListeners.size,
        messageHandlers: Array.from(this.messageHandlers.entries()).map(([dest, handlers]) => ({
          destination: dest,
          handlerCount: handlers.size,
        })),
        stompSubscriptions: Array.from(this.stompSubscriptions.keys()),
        state: this.state,
      };
    }
    return null;
  }
}

export const stompService = StompService.getInstance();
