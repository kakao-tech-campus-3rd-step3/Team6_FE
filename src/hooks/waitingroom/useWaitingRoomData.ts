import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { subscriptionManager } from "@/hooks/stomp/StompSubscriptionManager";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useReducer, useRef } from "react";

import { waitingRoomReducer } from "./waitingRoomReducer";

interface UseWaitingRoomDataProps {
  roomId: string;
  isHost: boolean;
}

const SYNC_DELAY = 100;

export const useWaitingRoomData = ({ roomId, isHost }: UseWaitingRoomDataProps) => {
  const { publish, isConnected } = useStompPublish();
  const [state, dispatch] = useReducer(waitingRoomReducer, {
    participants: [],
    maxParticipants: 0,
  });

  const instanceId = useRef(`instance-${Date.now()}-${Math.random()}`);

  const handleRoomMessage = useCallback(
    (message: IMessage) => {
      console.log(`[${instanceId.current}] 방 ${roomId} 메시지:`, message.body);
      try {
        const data = JSON.parse(message.body);
        const payload = data.data?.payload || data.payload || data;
        console.log(payload);

        if (payload.room && Array.isArray(payload.participants)) {
          console.log("전체 방 정보 업데이트:", payload);
          dispatch({
            type: "ROOM_INFO_UPDATE",
            payload: { participants: payload.participants, room: payload.room },
          });
          return;
        }

        if (payload.type === "PARTICIPANT_LIST" || payload.participants) {
          console.log("참가자 목록 업데이트:", payload.participants || []);
          dispatch({
            type: "PARTICIPANT_LIST",
            payload: { participants: payload.participants || [] },
          });
          return;
        }

        if (payload.type === "PARTICIPANT_JOINED" && payload.newParticipant) {
          console.log("PARTICIPANT_JOINED - 새 참가자 추가:", payload.newParticipant);
          dispatch({
            type: "PARTICIPANT_JOINED",
            payload: { newParticipant: payload.newParticipant },
          });
          return;
        }

        if (payload.type === "USER_LEFT" && payload.userId) {
          console.log("참가자 퇴장:", payload.userId);
          dispatch({
            type: "USER_LEFT",
            payload: { userId: payload.userId },
          });

          return;
        }
      } catch (error) {
        console.error(`[${instanceId.current}] 방 ${roomId} 메시지 파싱 오류:`, error);
      }
    },
    [roomId],
  );

  const handleErrorMessage = useCallback((message: IMessage) => {
    console.error(`[${instanceId.current}] 에러:`, message.body);
  }, []);

  const { isSubscribed: roomSubscribed } = useStompSubscription(
    roomId ? `/topic/waiting-room/${roomId}` : null,
    handleRoomMessage,
    {},
  );

  const { isSubscribed: errorSubscribed } = useStompSubscription("/user/queue/errors", handleErrorMessage, {});

  useEffect(() => {
    if (!roomId || isHost || !isConnected || !roomSubscribed) {
      return;
    }

    const topic = `/topic/waiting-room/${roomId}`;
    if (subscriptionManager.isSubscribed(topic)) {
      console.log(`[${instanceId.current}] 이미 구독됨: ${roomId}`);

      const timer = setTimeout(() => {
        publish(`/app/waiting-room/${roomId}/join`, {});
        console.log(`[${instanceId.current}] 방 ${roomId} 참여 요청 전송`);
      }, SYNC_DELAY);

      return () => clearTimeout(timer);
    }
  }, [roomId, isHost, isConnected, publish, roomSubscribed]);

  return {
    participants: state.participants,
    maxParticipants: state.maxParticipants,
    isConnected,
    roomSubscribed,
    errorSubscribed,
  };
};
