import { stompService } from "@/services/stomp/StompService";
import type { PushFunction, ReplaceFunction } from "@/services/stomp/types";
import { getPageFromStage } from "@/utils/stage";
import type { IMessage } from "@stomp/stompjs";

class StageNavigator {
  private static instance: StageNavigator;

  private unsubscribeStomp: (() => void) | null = null;
  private currentRoomId: string | null = null;
  private lastEventTypeMap = new Map<string, string>();
  private subscribers = new Set<string>();

  private push: PushFunction | null = null;
  private replace: ReplaceFunction | null = null;
  private isHost = false;

  private constructor() {}

  public static getInstance(): StageNavigator {
    if (!StageNavigator.instance) {
      StageNavigator.instance = new StageNavigator();
    }
    return StageNavigator.instance;
  }

  public setFlowActions(push: PushFunction, replace: ReplaceFunction) {
    this.push = push;
    this.replace = replace;
  }

  public setIsHost(isHost: boolean) {
    this.isHost = isHost;
  }

  public setLastEventType(roomId: string, eventType: string) {
    this.lastEventTypeMap.set(roomId, eventType);
  }

  public attach(roomId: string, subscriberId: string) {
    this.subscribers.add(subscriberId);
    this.subscribeToRoom(roomId);
  }

  public detach(subscriberId: string) {
    this.subscribers.delete(subscriberId);
    if (this.subscribers.size === 0) {
      this.unsubscribeFromRoom();
    }
  }

  private subscribeToRoom(roomId: string) {
    if (!roomId) {
      this.unsubscribeFromRoom();
      return;
    }

    if (this.currentRoomId === roomId && this.unsubscribeStomp) {
      return;
    }

    this.unsubscribeFromRoom();

    this.currentRoomId = roomId;
    const destination = `/topic/room-stage/${roomId}`;

    this.unsubscribeStomp = stompService.subscribe(destination, this.handleMessage);
  }

  private unsubscribeFromRoom() {
    if (this.unsubscribeStomp) {
      this.unsubscribeStomp();
      this.unsubscribeStomp = null;
      this.currentRoomId = null;
    }
  }

  private handleMessage = (message: IMessage) => {
    try {
      if (!this.currentRoomId || !this.push || !this.replace) {
        return;
      }

      const response = JSON.parse(message.body);
      const stage = response.data?.stage;
      const lastEventType = this.lastEventTypeMap.get(this.currentRoomId);

      if (stage) {
        const pageInfo = getPageFromStage(stage, this.currentRoomId, this.isHost);
        if (pageInfo) {
          if (lastEventType === "PREV") {
            this.replace(pageInfo.activity, pageInfo.params || {});
          } else {
            this.push(pageInfo.activity, pageInfo.params || {});
          }
          this.lastEventTypeMap.delete(this.currentRoomId);
        }
      }
    } catch (error) {
      console.error("스테이지 변경 메시지 파싱 오류:", error);
    }
  };
}

export const stageNavigator = StageNavigator.getInstance();
