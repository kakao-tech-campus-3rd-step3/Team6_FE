import type { StageNavigatorTestType } from "@/__test__/test-type";
import { stageNavigator } from "@/services/stomp/StageNavigator";
import type { NavigateFn, SignalService } from "@/services/stomp/types";
import { getPageFromStage } from "@/utils/stage";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/stage");

describe("StageNavigator - 에러 핸들링", () => {
  let mockNavigate: NavigateFn;
  let mockUnsubscribe: () => void;
  let mockSignalService: SignalService;

  beforeEach(() => {
    vi.clearAllMocks();

    const internal = stageNavigator as unknown as StageNavigatorTestType;
    internal.unsubscribeStomp = null;
    internal.currentRoomId = null;
    internal.lastEventTypeMap = new Map();
    internal.subscribers = new Set();
    internal.navigate = null;
    internal.isHost = false;

    mockNavigate = vi.fn();
    mockUnsubscribe = vi.fn();

    mockSignalService = {
      subscribe: vi.fn(),
    } as unknown as SignalService;

    stageNavigator.setSignalService(mockSignalService);
    stageNavigator.setNavigate(mockNavigate);
  });

  describe("STOMP 연결 실패", () => {
    it("subscribe 실패 시 에러를 throw해야 한다", () => {
      vi.mocked(mockSignalService.subscribe).mockImplementation(() => {
        throw new Error("Network connection failed");
      });

      expect(() => {
        stageNavigator.attach("room-123", "subscriber-1");
      }).toThrow("Network connection failed");
    });

    it("unsubscribe 중 에러가 발생해도 내부 상태는 정리되어야 한다", () => {
      const mockUnsubscribeWithError = vi.fn(() => {
        throw new Error("Unsubscribe failed");
      });

      vi.mocked(mockSignalService.subscribe).mockReturnValue(mockUnsubscribeWithError);
      stageNavigator.attach("room-123", "subscriber-1");

      expect(() => {
        stageNavigator.detach("subscriber-1");
      }).toThrow("Unsubscribe failed");

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.subscribers.has("subscriber-1")).toBe(false);
    });

    it("연결 끊김 후 다른 room으로 재구독 시 기존 구독이 정리되어야 한다", () => {
      const firstUnsubscribe = vi.fn();
      const secondUnsubscribe = vi.fn();

      vi.mocked(mockSignalService.subscribe)
        .mockReturnValueOnce(firstUnsubscribe)
        .mockReturnValueOnce(secondUnsubscribe);

      stageNavigator.attach("room-123", "subscriber-1");
      expect(mockSignalService.subscribe).toHaveBeenCalledWith("/topic/room-stage/room-123", expect.any(Function));

      stageNavigator.attach("room-456", "subscriber-2");

      expect(firstUnsubscribe).toHaveBeenCalledOnce();
      expect(mockSignalService.subscribe).toHaveBeenCalledWith("/topic/room-stage/room-456", expect.any(Function));

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.currentRoomId).toBe("room-456");
    });
  });

  describe("메시지 손상/유실", () => {
    beforeEach(() => {
      vi.mocked(mockSignalService.subscribe).mockReturnValue(mockUnsubscribe);
    });

    it("메시지에 data 필드가 없어도 에러 없이 처리해야 한다", () => {
      stageNavigator.attach("room-123", "subscriber-1");
      const handleMessage = vi.mocked(mockSignalService.subscribe).mock.calls[0][1];

      const response = { status: "ok" };

      handleMessage(response);

      expect(getPageFromStage).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("부분 데이터 손실", () => {
    beforeEach(() => {
      vi.mocked(mockSignalService.subscribe).mockReturnValue(mockUnsubscribe);
      vi.mocked(getPageFromStage).mockReset();
    });

    it("data.stage가 null이면 네비게이션하지 않아야 한다", () => {
      stageNavigator.attach("room-123", "subscriber-1");
      const handleMessage = vi.mocked(mockSignalService.subscribe).mock.calls[0][1];

      const response = {
        data: { stage: null },
      };

      handleMessage(response);

      expect(getPageFromStage).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("data.stage가 undefined이면 네비게이션하지 않아야 한다", () => {
      stageNavigator.attach("room-123", "subscriber-1");
      const handleMessage = vi.mocked(mockSignalService.subscribe).mock.calls[0][1];

      const response = {
        data: { stage: undefined },
      };

      handleMessage(response);

      expect(getPageFromStage).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("getPageFromStage가 예외를 던져도 에러를 처리해야 한다", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      vi.mocked(getPageFromStage).mockReset();
      vi.mocked(getPageFromStage).mockImplementation(() => {
        throw new Error("Invalid stage");
      });

      stageNavigator.attach("room-123", "subscriber-1");
      const handleMessage = vi.mocked(mockSignalService.subscribe).mock.calls[0][1];

      const response = {
        data: { stage: "INVALID_STAGE" },
      };

      expect(() => {
        handleMessage(response);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith("페이지 네비게이션 실패", expect.any(Error));

      vi.mocked(getPageFromStage).mockReset();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("동시성 문제", () => {
    it("빠른 연속 attach/detach 호출에도 구독 상태가 정확해야 한다", () => {
      vi.mocked(mockSignalService.subscribe).mockReturnValue(mockUnsubscribe);

      stageNavigator.attach("room-123", "sub-1");
      stageNavigator.attach("room-123", "sub-2");
      stageNavigator.detach("sub-1");
      stageNavigator.attach("room-123", "sub-3");
      stageNavigator.detach("sub-2");

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.subscribers.size).toBe(1);
      expect(internal.subscribers.has("sub-3")).toBe(true);
      expect(mockUnsubscribe).not.toHaveBeenCalled();
    });

    it("같은 subscriber가 빠르게 attach/detach를 반복해도 정상 동작해야 한다", () => {
      vi.mocked(mockSignalService.subscribe).mockReturnValue(mockUnsubscribe);

      const iterations = 5;
      for (let i = 0; i < iterations; i++) {
        stageNavigator.attach("room-123", "sub-1");
        stageNavigator.detach("sub-1");
      }

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.subscribers.size).toBe(0);
      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
