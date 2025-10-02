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

  const handleRoomMessage = useCallback((message: IMessage) => {
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
    } catch {
      return;
    }
  }, []);

  useStompSubscription(roomId ? `/topic/waiting-room/${roomId}` : null, handleRoomMessage);

  useEffect(() => {
    if (!roomId || isHost || !isConnected) {
      return;
    }

    const timer = setTimeout(() => {
      publish(`/app/waiting-room/${roomId}/join`, {});
    }, SYNC_DELAY);

    return () => clearTimeout(timer);
  }, [roomId, isHost, isConnected, publish]);

  return {
    participants: state.participants,
    maxParticipants: state.maxParticipants,
    isConnected,
  };
};
