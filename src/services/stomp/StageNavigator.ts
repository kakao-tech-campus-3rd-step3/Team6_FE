import { StompErrorFactory } from "@/errors/stomp-error-factory";
import { stompService } from "@/services/stomp/StompService";
import type { NavigateFn, RoomChangeResponse } from "@/services/stomp/types";
import { getPageFromStage } from "@/utils/stage";
import type { IMessage } from "@stomp/stompjs";

class StageNavigator {
  private static instance: StageNavigator;

  private unsubscribeStomp: (() => void) | null = null;
  private currentRoomId: string | null = null;
  private lastEventTypeMap = new Map<string, string>();
  private subscribers = new Set<string>();

  private navigate: NavigateFn | null = null;
  private isHost = false;

  private constructor() {}

  public static getInstance(): StageNavigator {
    if (!StageNavigator.instance) {
      StageNavigator.instance = new StageNavigator();
    }
    return StageNavigator.instance;
  }

  public setNavigate(navigate: NavigateFn) {
    this.navigate = navigate;
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

    try {
      this.unsubscribeStomp = stompService.subscribe(destination, this.handleMessage);
    } catch (error) {
      const stompError = StompErrorFactory.fromSubscriptionError(destination, error);
      console.error(stompError.message, {
        code: stompError.code,
        metadata: stompError.metadata,
      });
      throw stompError;
    }
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
      if (!this.currentRoomId || !this.navigate) {
        return;
      }

      const response = JSON.parse(message.body) as RoomChangeResponse;

      const stage = response.data?.stage;
      const lastEventType = this.lastEventTypeMap.get(this.currentRoomId);

      if (stage) {
        const pageUrl = getPageFromStage(stage, this.currentRoomId, this.isHost);
        if (pageUrl) {
          if (lastEventType === "PREV") {
            this.navigate(pageUrl, { state: { direction: "back" } });
          } else {
            this.navigate(pageUrl, { state: { direction: "forward" } });
          }
          this.lastEventTypeMap.delete(this.currentRoomId);
        }
      }
    } catch (error) {
      const stompError = StompErrorFactory.fromMessageParseError(error, message.body);
      console.error(stompError.message, {
        code: stompError.code,
        metadata: stompError.metadata,
      });
    }
  };
}

export const stageNavigator = StageNavigator.getInstance();
