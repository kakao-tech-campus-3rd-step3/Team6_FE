import { stompService } from "@/services/stomp/StompService";
import { useAuthStore } from "@/store/authStore";
import { Client, type StompSubscription } from "@stomp/stompjs";
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
      expect(state.error).toContain("인증 토큰이 없어");
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
});
