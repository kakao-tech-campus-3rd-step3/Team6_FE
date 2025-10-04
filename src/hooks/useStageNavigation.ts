import { stompService } from "@/services/stomp/StompService";
import { getPageFromStage } from "@/utils/stage";
import { useActivity, useFlow } from "@stackflow/react/future";
import type { IMessage } from "@stomp/stompjs";
import { useEffect } from "react";

import { useStompConnection } from "./stomp";

const lastEventTypeMap = new Map<string, string>();

let globalUnsubscribe: (() => void) | null = null;
let currentRoomId: string | null = null;
let subscriberCount = 0;
let pushRef: ((activity: string, params: Record<string, string>) => void) | null = null;
let replaceRef: ((activity: string, params: Record<string, string>) => void) | null = null;
let isHostRef = false;

const updateSubscription = (roomId: string, isConnected: boolean) => {
  if (!roomId || !isConnected) {
    if (globalUnsubscribe) {
      globalUnsubscribe();
      globalUnsubscribe = null;
      currentRoomId = null;
    }
    return;
  }

  if (currentRoomId === roomId && globalUnsubscribe) {
    return;
  }

  if (globalUnsubscribe) {
    globalUnsubscribe();
    globalUnsubscribe = null;
  }

  currentRoomId = roomId;
  const destination = `/topic/room-stage/${roomId}`;

  globalUnsubscribe = stompService.subscribe(destination, (message: IMessage) => {
    try {
      const response = JSON.parse(message.body);
      const stage = response.data?.stage;
      const lastEventType = lastEventTypeMap.get(currentRoomId!);

      if (stage && pushRef && replaceRef) {
        const pageInfo = getPageFromStage(stage, currentRoomId!, isHostRef);
        if (pageInfo) {
          if (lastEventType === "PREV") {
            replaceRef(pageInfo.activity, pageInfo.params || {});
          } else {
            pushRef(pageInfo.activity, pageInfo.params || {});
          }
          lastEventTypeMap.delete(currentRoomId!);
        }
      }
    } catch (error) {
      console.error("스테이지 변경 메시지 파싱 오류:", error);
    }
  });
};

export const setLastEventType = (roomId: string, eventType: string) => {
  lastEventTypeMap.set(roomId, eventType);
};

export const useStageNavigation = () => {
  const { push, replace } = useFlow();
  const { params } = useActivity();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const isHost = params?.isHost === "true";
  const { isConnected } = useStompConnection();

  useEffect(() => {
    pushRef = push;
    replaceRef = replace;
    isHostRef = isHost;
  }, [push, replace, isHost]);

  useEffect(() => {
    subscriberCount++;

    updateSubscription(roomId, isConnected);

    return () => {
      subscriberCount--;
      if (subscriberCount === 0 && globalUnsubscribe) {
        globalUnsubscribe();
        globalUnsubscribe = null;
        currentRoomId = null;
      }
    };
  }, [roomId, isConnected]);
};
