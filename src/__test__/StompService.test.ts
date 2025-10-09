import { stompService } from "@/services/stomp/StompService";
import { useAuthStore } from "@/store/authStore";
import { Client, type IFrame, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@stomp/stompjs");
vi.mock("@/store/authStore");

describe("StompService", () => {
  let mockSubscription: StompSubscription;

  const createMockClient = (options: Partial<Client> = {}): Partial<Client> => {
    return {
      active: true,
      connected: true,
      activate: vi.fn(),
      deactivate: vi.fn(),
      publish: vi.fn(),
      subscribe: vi.fn().mockReturnValue(mockSubscription),
      ...options,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    stompService["messageHandlers"].clear();
    stompService["stompSubscriptions"].clear();
    stompService["client"] = null;
    stompService["state"] = { isConnected: false, isConnecting: false, error: null };

    mockSubscription = { unsubscribe: vi.fn() } as unknown as StompSubscription;
  });

  describe("초기화", () => {
    it("토큰이 없다면 클라이언트를 생성하지 않아야 한다.", () => {
      vi.mocked(useAuthStore.getState).mockReturnValue({ token: null, id: null, setAuth: vi.fn(), clearAuth: vi.fn() });

      stompService.initialize("ws://test-url", null);

      expect(Client).not.toHaveBeenCalled();
      const state = stompService.getState();
      expect(state.isConnected).toBe(false);
      expect(state.error).not.toBeNull();
      expect(state.error?.message).toContain("인증 토큰");
    });

    it("토큰이 있을 때, 클라이언트를 생성해야 한다.", () => {
      const brokerURL = "ws://test-url";
      const token = "test-token";
      vi.mocked(useAuthStore.getState).mockReturnValue({
        token: "test-token",
        id: null,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      });

      stompService.initialize(brokerURL, token);

      expect(Client).toHaveBeenCalledOnce();
      expect(Client).toHaveBeenCalledWith(
        expect.objectContaining({
          connectHeaders: { Authorization: `Bearer ${token}` },
        }),
      );
    });
  });

  describe("activate", () => {
    it("클라이언트가 비활성화 상태일 때 activate를 호출해야 한다.", () => {
      const mockClient = createMockClient({ active: false, connected: false });
      vi.mocked(Client).mockImplementation(() => mockClient as Client);

      stompService.initialize("ws://test-url", "test-token");
      stompService.activate();

      expect(mockClient.activate).toHaveBeenCalledOnce();
    });

    it("클라이언트가 이미 활성화되어 있으면 activate를 호출하지 않아야 한다.", () => {
      const mockClient = createMockClient();
      vi.mocked(Client).mockImplementation(() => mockClient as Client);

      stompService.initialize("ws://test-url", "test-token");
      stompService.activate();

      expect(mockClient.activate).not.toHaveBeenCalled();
    });
  });

  describe("publish", () => {
    it("연결되지 않은 상태에서 publish 호출 시 false를 반환해야 한다.", () => {
      const result = stompService.publish("/test/destination", { message: "test" });

      expect(result).toBe(false);
    });

    it("연결된 상태에서 publish 호출 시 올바른 파라미터로 호출되어야 한다.", () => {
      const mockClient = createMockClient();
      vi.mocked(Client).mockImplementation(() => mockClient as Client);
      vi.mocked(useAuthStore.getState).mockReturnValue({
        token: "test-token",
        id: null,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      });

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };

      const destination = "/test/destination";
      const body = { message: "test" };
      const result = stompService.publish(destination, body);

      expect(result).toBe(true);
      expect(mockClient.publish).toHaveBeenCalledWith({
        destination,
        body: JSON.stringify(body),
        headers: {
          Authorization: "Bearer test-token",
          "content-type": "application/json",
        },
        skipContentLengthHeader: undefined,
      });
    });

    it("커스텀 헤더와 함께 publish 호출 시 헤더가 병합되어야 한다.", () => {
      const mockClient = createMockClient();
      vi.mocked(Client).mockImplementation(() => mockClient as Client);
      vi.mocked(useAuthStore.getState).mockReturnValue({
        token: "test-token",
        id: null,
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      });

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };

      const customHeaders = { "custom-header": "custom-value" };
      stompService.publish("/test", "test", { headers: customHeaders });

      expect(mockClient.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
            "custom-header": "custom-value",
          }),
        }),
      );
    });
  });

  describe("subscribe", () => {
    it("연결된 상태에서 구독 시 클라이언트의 subscribe가 호출되어야 한다.", () => {
      const mockClient = createMockClient();
      vi.mocked(Client).mockImplementation(() => mockClient as Client);

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };

      const destination = "/test/destination";
      const callback = vi.fn();
      const unsubscribe = stompService.subscribe(destination, callback);

      expect(mockClient.subscribe).toHaveBeenCalledWith(destination, expect.any(Function));
      expect(typeof unsubscribe).toBe("function");
    });

    it("연결되지 않은 상태에서 구독 시 클라이언트의 subscribe가 호출되지 않아야 한다.", () => {
      const mockClient = createMockClient({ active: false, connected: false });
      vi.mocked(Client).mockImplementation(() => mockClient as Client);

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: false, isConnecting: false, error: null };

      const callback = vi.fn();
      stompService.subscribe("/test/destination", callback);

      expect(mockClient.subscribe).not.toHaveBeenCalled();
    });

    it("구독 해제 시 모든 핸들러가 제거되면 STOMP 구독도 해제되어야 한다.", () => {
      const mockClient = createMockClient();
      vi.mocked(Client).mockImplementation(() => mockClient as Client);

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };
      stompService["client"] = mockClient as Client;

      const destination = "/test/destination";
      const unsubscribe = stompService.subscribe(destination, vi.fn());

      expect(mockClient.subscribe).toHaveBeenCalledWith(destination, expect.any(Function));

      expect(stompService["stompSubscriptions"].has(destination)).toBe(true);

      unsubscribe();

      expect(stompService["stompSubscriptions"].has(destination)).toBe(false);
      expect(mockSubscription.unsubscribe).toHaveBeenCalledOnce();
    });
  });

  describe("deactivate", () => {
    it("활성화된 클라이언트를 비활성화해야 한다.", () => {
      const mockClient = createMockClient();
      vi.mocked(Client).mockImplementation(() => mockClient as Client);

      stompService.initialize("ws://test-url", "test-token");
      stompService.deactivate();

      expect(mockClient.deactivate).toHaveBeenCalledOnce();
    });

    it("비활성화된 클라이언트에 대해서는 deactivate를 호출하지 않아야 한다.", () => {
      const mockClient = createMockClient({ active: false });
      vi.mocked(Client).mockImplementation(() => mockClient as Client);

      stompService.initialize("ws://test-url", "test-token");
      stompService.deactivate();

      expect(mockClient.deactivate).not.toHaveBeenCalled();
    });
  });

  describe("상태 변경 리스너", () => {
    it("리스너 등록 즉시 현재 상태를 전달해야 한다", () => {
      const listener = vi.fn();
      stompService.subscribeToState(listener);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          isConnected: false,
          isConnecting: false,
        }),
      );
    });

    it("상태 변경 시 모든 리스너가 호출되어야 한다", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      stompService.subscribeToState(listener1);
      stompService.subscribeToState(listener2);

      listener1.mockClear();
      listener2.mockClear();

      stompService["state"] = { isConnected: true, isConnecting: false, error: null };
      stompService["notifyStateListeners"]();

      expect(listener1).toHaveBeenCalledOnce();
      expect(listener2).toHaveBeenCalledOnce();
      expect(listener1).toHaveBeenCalledWith(
        expect.objectContaining({
          isConnected: true,
        }),
      );
    });

    it("unsubscribe 후에는 리스너가 호출되지 않아야 한다", () => {
      const listener = vi.fn();
      const unsubscribe = stompService.subscribeToState(listener);

      listener.mockClear();
      unsubscribe();

      stompService["state"] = { isConnected: true, isConnecting: false, error: null };
      stompService["notifyStateListeners"]();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("메시지 수신", () => {
    it("메시지 수신 시 핸들러가 호출되어야 한다", () => {
      const mockClient = createMockClient();
      let messageHandler: ((message: IMessage) => void) | undefined;

      vi.mocked(Client).mockImplementation(() => mockClient as Client);
      mockClient.subscribe = vi.fn((_dest, handler) => {
        messageHandler = handler;
        return mockSubscription;
      });

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };
      stompService["client"] = mockClient as Client;

      const callback = vi.fn();
      stompService.subscribe("/test", callback);

      const testMessage = { body: '{"data":"test"}' } as unknown as IMessage;
      messageHandler?.(testMessage);

      expect(callback).toHaveBeenCalledWith(testMessage);
    });

    it("같은 destination에 여러 핸들러 등록 시 모두 호출되어야 한다", () => {
      const mockClient = createMockClient();
      let messageHandler: ((message: IMessage) => void) | undefined;

      vi.mocked(Client).mockImplementation(() => mockClient as Client);
      mockClient.subscribe = vi.fn((_dest, handler) => {
        messageHandler = handler;
        return mockSubscription;
      });

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };
      stompService["client"] = mockClient as Client;

      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      stompService.subscribe("/test", callback1);
      stompService.subscribe("/test", callback2);
      stompService.subscribe("/test", callback3);

      const testMessage = { body: '{"data":"test"}' } as unknown as IMessage;
      messageHandler?.(testMessage);

      expect(callback1).toHaveBeenCalledWith(testMessage);
      expect(callback2).toHaveBeenCalledWith(testMessage);
      expect(callback3).toHaveBeenCalledWith(testMessage);
    });

    it("핸들러에서 에러 발생 시 에러 상태가 설정되어야 한다", () => {
      const mockClient = createMockClient();
      let messageHandler: ((message: IMessage) => void) | undefined;

      vi.mocked(Client).mockImplementation(() => mockClient as Client);
      mockClient.subscribe = vi.fn((_dest, handler) => {
        messageHandler = handler;
        return mockSubscription;
      });

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };
      stompService["client"] = mockClient as Client;

      const errorCallback = vi.fn(() => {
        throw new Error("Handler error");
      });
      stompService.subscribe("/test", errorCallback);

      const testMessage = { body: '{"data":"test"}' } as unknown as IMessage;
      messageHandler?.(testMessage);

      const state = stompService.getState();
      expect(state.error).not.toBeNull();
      expect(state.error?.code).toBe("STOMP_MESSAGE_PARSE_ERROR");
    });

    it("한 핸들러에서 에러가 발생해도 다른 핸들러는 계속 실행되어야 한다", () => {
      const mockClient = createMockClient();
      let messageHandler: ((message: IMessage) => void) | undefined;

      vi.mocked(Client).mockImplementation(() => mockClient as Client);
      mockClient.subscribe = vi.fn((_dest, handler) => {
        messageHandler = handler;
        return mockSubscription;
      });

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };
      stompService["client"] = mockClient as Client;

      const errorCallback = vi.fn(() => {
        throw new Error("Handler error");
      });
      const successCallback = vi.fn();

      stompService.subscribe("/test", errorCallback);
      stompService.subscribe("/test", successCallback);

      const testMessage = { body: '{"data":"test"}' } as unknown as IMessage;
      messageHandler?.(testMessage);

      expect(errorCallback).toHaveBeenCalled();
      expect(successCallback).toHaveBeenCalled();
    });
  });

  describe("재연결 로직", () => {
    it("연결 끊김 시 isConnected가 false로 변경되어야 한다", () => {
      let onDisconnect: ((frame: IFrame) => void) | undefined;
      const mockClient = createMockClient();

      vi.mocked(Client).mockImplementation((config) => {
        onDisconnect = config?.onDisconnect;
        return mockClient as Client;
      });

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };

      onDisconnect?.({} as IFrame);

      const state = stompService.getState();
      expect(state.isConnected).toBe(false);
      expect(state.isConnecting).toBe(false);
    });

    it("비정상 종료 시 재연결 상태로 전환되어야 한다", () => {
      let onWebSocketClose: ((event: CloseEvent) => void) | undefined;
      const mockClient = createMockClient();

      vi.mocked(Client).mockImplementation((config) => {
        onWebSocketClose = config?.onWebSocketClose;
        return mockClient as Client;
      });

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };

      const closeEvent = {
        wasClean: false,
        code: 1006,
        reason: "Abnormal closure",
      } as CloseEvent;

      onWebSocketClose?.(closeEvent);

      const state = stompService.getState();
      expect(state.isConnected).toBe(false);
      expect(state.isConnecting).toBe(true);
      expect(state.error).not.toBeNull();
    });

    it("정상 종료 시에는 재연결 상태로 전환되지 않아야 한다", () => {
      let onWebSocketClose: ((event: CloseEvent) => void) | undefined;
      const mockClient = createMockClient();

      vi.mocked(Client).mockImplementation((config) => {
        onWebSocketClose = config?.onWebSocketClose;
        return mockClient as Client;
      });

      stompService.initialize("ws://test-url", "test-token");
      stompService["state"] = { isConnected: true, isConnecting: false, error: null };

      const closeEvent = {
        wasClean: true,
        code: 1000,
        reason: "Normal closure",
      } as CloseEvent;

      onWebSocketClose?.(closeEvent);

      const state = stompService.getState();
      expect(state.isConnected).toBe(false);
      expect(state.isConnecting).toBe(false);
    });

    it("재연결 설정이 5초로 되어 있어야 한다", () => {
      vi.mocked(Client).mockImplementation((config) => {
        // eslint-disable-next-line no-magic-numbers
        expect(config?.reconnectDelay).toBe(5000);
        return createMockClient() as Client;
      });

      stompService.initialize("ws://test-url", "test-token");
    });
  });
});
