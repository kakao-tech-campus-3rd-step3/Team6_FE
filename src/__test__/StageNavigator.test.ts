import type { StageNavigatorTestType } from "@/__test__/test-type";
import { stageNavigator } from "@/services/stomp/StageNavigator";
import { stompService } from "@/services/stomp/StompService";
import type { NavigateFn } from "@/services/stomp/types";
import { getPageFromStage } from "@/utils/stage";
import type { IMessage } from "@stomp/stompjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/stomp/StompService");
vi.mock("@/utils/stage");

describe("StageNavigator", () => {
  let mockNavigate: NavigateFn;
  let mockUnsubscribe: () => void;

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
  });

  describe("싱글톤 패턴", () => {
    it("getInstance는 항상 같은 인스턴스를 반환해야 한다", () => {
      type StageNavigatorConstructor = typeof stageNavigator.constructor & {
        getInstance: () => typeof stageNavigator;
      };
      const instance1 = (stageNavigator.constructor as StageNavigatorConstructor).getInstance();
      const instance2 = (stageNavigator.constructor as StageNavigatorConstructor).getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBe(stageNavigator);
    });
  });

  describe("setNavigate", () => {
    it("navigate 함수를 설정해야 한다", () => {
      stageNavigator.setNavigate(mockNavigate);

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.navigate).toBe(mockNavigate);
    });
  });

  describe("setIsHost", () => {
    it("isHost 상태를 true로 설정해야 한다", () => {
      stageNavigator.setIsHost(true);

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.isHost).toBe(true);
    });

    it("isHost 상태를 false로 설정해야 한다", () => {
      stageNavigator.setIsHost(false);

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.isHost).toBe(false);
    });
  });

  describe("setLastEventType", () => {
    it("roomId에 해당하는 이벤트 타입을 저장해야 한다", () => {
      const roomId = "room-123";
      const eventType = "PREV";

      stageNavigator.setLastEventType(roomId, eventType);

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.lastEventTypeMap.get(roomId)).toBe(eventType);
    });

    it("같은 roomId에 대해 이벤트 타입을 덮어써야 한다", () => {
      const roomId = "room-123";

      stageNavigator.setLastEventType(roomId, "PREV");
      stageNavigator.setLastEventType(roomId, "NEXT");

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.lastEventTypeMap.get(roomId)).toBe("NEXT");
    });
  });

  describe("attach", () => {
    beforeEach(() => {
      vi.mocked(stompService.subscribe).mockReturnValue(mockUnsubscribe);
    });

    it("구독자를 추가하고 STOMP 구독을 시작해야 한다", () => {
      const roomId = "room-123";
      const subscriberId = "subscriber-1";

      stageNavigator.attach(roomId, subscriberId);

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.subscribers.has(subscriberId)).toBe(true);
      expect(stompService.subscribe).toHaveBeenCalledWith(`/topic/room-stage/${roomId}`, expect.any(Function));
    });

    it("같은 subscriberId로 여러 번 attach해도 Set에는 1개만 존재해야 한다", () => {
      const roomId = "room-123";
      const subscriberId = "subscriber-1";
      const expectedSubscriberCount = 1;

      stageNavigator.attach(roomId, subscriberId);
      stageNavigator.attach(roomId, subscriberId);
      stageNavigator.attach(roomId, subscriberId);

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.subscribers.size).toBe(expectedSubscriberCount);
    });

    it("다른 subscriberId는 별도로 추가되어야 한다", () => {
      const roomId = "room-123";
      const expectedSubscriberCount = 3;

      stageNavigator.attach(roomId, "subscriber-1");
      stageNavigator.attach(roomId, "subscriber-2");
      stageNavigator.attach(roomId, "subscriber-3");

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.subscribers.size).toBe(expectedSubscriberCount);
    });

    it("이미 같은 roomId로 구독 중이면 재구독하지 않아야 한다", () => {
      const roomId = "room-123";

      stageNavigator.attach(roomId, "subscriber-1");
      vi.clearAllMocks();

      stageNavigator.attach(roomId, "subscriber-2");

      expect(stompService.subscribe).not.toHaveBeenCalled();
    });

    it("다른 roomId로 attach하면 기존 구독을 해제하고 새로 구독해야 한다", () => {
      const expectedSubscribeCallCount = 2;

      stageNavigator.attach("room-123", "subscriber-1");

      expect(mockUnsubscribe).not.toHaveBeenCalled();
      expect(stompService.subscribe).toHaveBeenCalledTimes(1);

      stageNavigator.attach("room-456", "subscriber-2");

      expect(mockUnsubscribe).toHaveBeenCalledOnce();
      expect(stompService.subscribe).toHaveBeenCalledTimes(expectedSubscribeCallCount);
      expect(stompService.subscribe).toHaveBeenLastCalledWith("/topic/room-stage/room-456", expect.any(Function));
    });

    it("빈 roomId로 attach하면 구독을 해제해야 한다", () => {
      stageNavigator.attach("room-123", "subscriber-1");
      vi.clearAllMocks();

      stageNavigator.attach("", "subscriber-2");

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(mockUnsubscribe).toHaveBeenCalledOnce();
      expect(internal.currentRoomId).toBeNull();
    });
  });

  describe("detach", () => {
    beforeEach(() => {
      vi.mocked(stompService.subscribe).mockReturnValue(mockUnsubscribe);
    });

    it("구독자를 제거해야 한다", () => {
      const subscriberId = "subscriber-1";
      stageNavigator.attach("room-123", subscriberId);

      stageNavigator.detach(subscriberId);

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.subscribers.has(subscriberId)).toBe(false);
    });

    it("구독자가 1명 남아있으면 STOMP 구독을 유지해야 한다", () => {
      stageNavigator.attach("room-123", "subscriber-1");
      stageNavigator.attach("room-123", "subscriber-2");

      stageNavigator.detach("subscriber-1");

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(mockUnsubscribe).not.toHaveBeenCalled();
      expect(internal.unsubscribeStomp).not.toBeNull();
    });

    it("모든 구독자가 detach되면 STOMP 구독을 해제해야 한다", () => {
      stageNavigator.attach("room-123", "subscriber-1");
      stageNavigator.attach("room-123", "subscriber-2");

      stageNavigator.detach("subscriber-1");
      stageNavigator.detach("subscriber-2");

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(mockUnsubscribe).toHaveBeenCalledOnce();
      expect(internal.unsubscribeStomp).toBeNull();
      expect(internal.currentRoomId).toBeNull();
    });

    it("존재하지 않는 subscriberId로 detach해도 에러가 발생하지 않아야 한다", () => {
      expect(() => {
        stageNavigator.detach("non-existent");
      }).not.toThrow();
    });
  });

  describe("handleMessage", () => {
    beforeEach(() => {
      vi.mocked(stompService.subscribe).mockReturnValue(mockUnsubscribe);
      stageNavigator.setNavigate(mockNavigate);
    });

    it("메시지를 받으면 getPageFromStage를 호출하고 navigate로 네비게이션해야 한다", () => {
      const roomId = "room-123";
      const mockPageUrl = "/profile-check?roomId=room-123&isHost=false";

      vi.mocked(getPageFromStage).mockReturnValue(mockPageUrl);

      stageNavigator.attach(roomId, "subscriber-1");
      const handleMessage = vi.mocked(stompService.subscribe).mock.calls[0][1];

      const message = {
        body: JSON.stringify({
          data: { stage: "PROFILE_CHECK" },
        }),
      } as IMessage;

      handleMessage(message);

      expect(getPageFromStage).toHaveBeenCalledWith("PROFILE_CHECK", roomId, false);
      expect(mockNavigate).toHaveBeenCalledWith(mockPageUrl, { state: { direction: "forward" } });
    });

    it("lastEventType이 NEXT이면 forward direction으로 네비게이션해야 한다", () => {
      const roomId = "room-123";
      const mockPageUrl = "/profile-check?roomId=room-123&isHost=false";

      vi.mocked(getPageFromStage).mockReturnValue(mockPageUrl);
      stageNavigator.setLastEventType(roomId, "NEXT");

      stageNavigator.attach(roomId, "subscriber-1");
      const handleMessage = vi.mocked(stompService.subscribe).mock.calls[0][1];

      const message = {
        body: JSON.stringify({
          data: { stage: "PROFILE_CHECK" },
        }),
      } as IMessage;

      handleMessage(message);

      expect(mockNavigate).toHaveBeenCalledWith(mockPageUrl, { state: { direction: "forward" } });

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.lastEventTypeMap.has(roomId)).toBe(false);
    });

    it("lastEventType이 PREV이면 back direction으로 네비게이션해야 한다", () => {
      const roomId = "room-123";
      const mockPageUrl = "/menu?roomId=room-123&isHost=false";

      vi.mocked(getPageFromStage).mockReturnValue(mockPageUrl);
      stageNavigator.setLastEventType(roomId, "PREV");

      stageNavigator.attach(roomId, "subscriber-1");
      const handleMessage = vi.mocked(stompService.subscribe).mock.calls[0][1];

      const message = {
        body: JSON.stringify({
          data: { stage: "MENU_SELECT" },
        }),
      } as IMessage;

      handleMessage(message);

      expect(mockNavigate).toHaveBeenCalledWith(mockPageUrl, { state: { direction: "back" } });

      const internal = stageNavigator as unknown as StageNavigatorTestType;
      expect(internal.lastEventTypeMap.has(roomId)).toBe(false);
    });

    it("isHost가 true일 때 getPageFromStage에 올바른 파라미터를 전달해야 한다", () => {
      const roomId = "room-123";
      const mockPageUrl = "/waiting-room?roomId=room-123&isHost=true";

      stageNavigator.setIsHost(true);
      vi.mocked(getPageFromStage).mockReturnValue(mockPageUrl);

      stageNavigator.attach(roomId, "subscriber-1");
      const handleMessage = vi.mocked(stompService.subscribe).mock.calls[0][1];

      const message = {
        body: JSON.stringify({
          data: { stage: "WAITING" },
        }),
      } as IMessage;

      handleMessage(message);

      expect(getPageFromStage).toHaveBeenCalledWith("WAITING", roomId, true);
    });

    it("navigate 함수가 설정되지 않았으면 네비게이션하지 않아야 한다", () => {
      const internal = stageNavigator as unknown as StageNavigatorTestType;
      internal.navigate = null;

      const roomId = "room-123";
      stageNavigator.attach(roomId, "subscriber-1");
      const handleMessage = vi.mocked(stompService.subscribe).mock.calls[0][1];

      const message = {
        body: JSON.stringify({
          data: { stage: "PROFILE_CHECK" },
        }),
      } as IMessage;

      handleMessage(message);

      expect(getPageFromStage).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("currentRoomId가 없으면 네비게이션하지 않아야 한다", () => {
      const roomId = "room-123";
      stageNavigator.attach(roomId, "subscriber-1");

      const handleMessage = vi.mocked(stompService.subscribe).mock.calls[0]?.[1] || vi.fn();
      const internal = stageNavigator as unknown as StageNavigatorTestType;
      internal.currentRoomId = null;
      const message = {
        body: JSON.stringify({
          data: { stage: "PROFILE_CHECK" },
        }),
      } as IMessage;

      handleMessage(message);

      expect(getPageFromStage).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("getPageFromStage가 null을 반환하면 네비게이션하지 않아야 한다", () => {
      const roomId = "room-123";
      vi.mocked(getPageFromStage).mockReturnValue(null);

      stageNavigator.attach(roomId, "subscriber-1");
      const handleMessage = vi.mocked(stompService.subscribe).mock.calls[0][1];

      const message = {
        body: JSON.stringify({
          data: { stage: "UNKNOWN_STAGE" },
        }),
      } as IMessage;

      handleMessage(message);

      expect(getPageFromStage).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("stage가 없으면 네비게이션하지 않아야 한다", () => {
      const roomId = "room-123";
      stageNavigator.attach(roomId, "subscriber-1");
      const handleMessage = vi.mocked(stompService.subscribe).mock.calls[0][1];

      const message = {
        body: JSON.stringify({
          data: {},
        }),
      } as IMessage;

      handleMessage(message);

      expect(getPageFromStage).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("잘못된 JSON 형식의 메시지를 받으면 에러를 콘솔에 출력하고 네비게이션하지 않아야 한다", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const roomId = "room-123";
      stageNavigator.attach(roomId, "subscriber-1");
      const handleMessage = vi.mocked(stompService.subscribe).mock.calls[0][1];

      const message = {
        body: "invalid json",
      } as IMessage;

      handleMessage(message);

      expect(consoleErrorSpy).toHaveBeenCalledWith("메시지 파싱 실패", "invalid json");
      expect(mockNavigate).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
