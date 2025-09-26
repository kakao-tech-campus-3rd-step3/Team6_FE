import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useReducer } from "react";

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

  const handleRoomMessage = useCallback(
    (message: IMessage) => {
      console.log(`방 ${roomId} 메시지:`, message.body);
      try {
        const data = JSON.parse(message.body);
        const payload = data.data?.payload || data.payload || data;

        if (payload.room && Array.isArray(payload.participants)) {
          dispatch({
            type: "ROOM_INFO_UPDATE",
            payload: { participants: payload.participants, room: payload.room },
          });
          return;
        }

        if (payload.type === "PARTICIPANT_LIST" || payload.participants) {
          dispatch({
            type: "PARTICIPANT_LIST",
            payload: { participants: payload.participants || [] },
          });
          return;
        }

        if (payload.type === "PARTICIPANT_JOINED" && payload.newParticipant) {
          dispatch({
            type: "PARTICIPANT_JOINED",
            payload: { newParticipant: payload.newParticipant },
          });
          return;
        }

        if (payload.type === "USER_LEFT" && payload.userId) {
          dispatch({ type: "USER_LEFT", payload: { userId: payload.userId } });

          return;
        }
      } catch (error) {
        console.error(`방 ${roomId} 메시지 파싱 오류:`, error);
      }
    },
    [roomId],
  );

  const handleErrorMessage = useCallback((message: IMessage) => {
    console.error(`에러:`, message.body);
  }, []);

  useStompSubscription(roomId ? `/topic/waiting-room/${roomId}` : null, handleRoomMessage);

  useStompSubscription("/user/queue/errors", handleErrorMessage);

  useEffect(() => {
    if (!roomId || isHost || !isConnected) {
      return;
    }

    const timer = setTimeout(() => {
      publish(`/app/waiting-room/${roomId}/join`, {});
      console.log(`방 ${roomId} 참여 요청 전송`);
    }, SYNC_DELAY);

    return () => clearTimeout(timer);
  }, [roomId, isHost, isConnected, publish]);

  return {
    participants: state.participants,
    maxParticipants: state.maxParticipants,
    isConnected,
  };
};
