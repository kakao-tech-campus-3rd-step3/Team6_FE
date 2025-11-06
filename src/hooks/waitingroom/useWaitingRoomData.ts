import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import type { UseWaitingRoomDataProps, WaitingRoomResponse } from "@/hooks/waitingroom/types";
import { getMessageBody } from "@/utils/stomp/getMessageBody";
import { showToast } from "@/utils/toast";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useReducer } from "react";

import { waitingRoomReducer } from "./waitingRoomReducer";

const SYNC_DELAY = 100;

export const useWaitingRoomData = ({ roomId, isHost }: UseWaitingRoomDataProps) => {
  const { publish, isConnected } = useStompPublish();
  const [state, dispatch] = useReducer(waitingRoomReducer, {
    participants: [],
    maxParticipants: 0,
  });

  const handleRoomMessage = useCallback((message: IMessage) => {
    const response = getMessageBody<WaitingRoomResponse>(message);

    if (!response) {
      console.error("대기방 메시지 파싱 실패:", message.body);
      showToast.error("메시지 파싱에 실패했습니다.");
      return;
    }

    if (!response.success) {
      showToast.error("메시지 파싱에 실패했습니다.");
      return;
    }

    // TODO : data구조 변경 요청하기
    const { type, payload } = response.data;

    if (payload.room && payload.participants) {
      dispatch({
        type: "ROOM_INFO_UPDATE",
        payload: { participants: payload.participants, room: payload.room },
      });
      return;
    }

    switch (type) {
      case "PARTICIPANT_LIST":
        dispatch({
          type: "PARTICIPANT_LIST",
          payload: { participants: payload.participants || [] },
        });
        break;

      case "PARTICIPANT_JOINED":
        if (payload.newParticipant) {
          dispatch({
            type: "PARTICIPANT_JOINED",
            payload: { newParticipant: payload.newParticipant },
          });
        }
        break;

      case "USER_LEFT":
        if (payload.userId) {
          dispatch({ type: "USER_LEFT", payload: { userId: payload.userId } });
        }
        break;
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
