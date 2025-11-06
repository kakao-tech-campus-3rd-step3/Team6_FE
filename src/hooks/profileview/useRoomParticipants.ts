import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { useUserStore } from "@/store/useUserStore";
import { getMessageBody } from "@/utils/stomp/getMessageBody";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { Participant } from "./types";

type RoomParticipantResponse = BaseResponse<Participant[]>;

const SYNC_DELAY = 100;

export const useRoomParticipants = (roomId: string) => {
  const { publish, isConnected } = useStompPublish();
  const [searchParams] = useSearchParams();
  const isHost = searchParams.get("isHost") === "true";
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // TODO : 백엔드 마니또 데이터가 정상이 되면 제거
  const roomParticipants = useUserStore((state) => state.setParticipants);
  const handleParticipantMessage = useCallback(
    (message: IMessage) => {
      const response = getMessageBody<RoomParticipantResponse>(message);

      if (!response) {
        console.error("참여자 목록 파싱 실패");
        setIsLoading(false);
        return;
      }

      if (response.success && Array.isArray(response.data)) {
        setParticipants(response.data);
        roomParticipants(response.data);
        setIsLoading(false);
      }
    },
    [roomParticipants],
  );

  useStompSubscription(roomId ? `/topic/room-participant/${roomId}` : null, handleParticipantMessage);

  useEffect(() => {
    if (!roomId || !isConnected || !isHost) {
      return;
    }

    const timer = setTimeout(() => {
      publish(`/app/room/${roomId}/participants`, {});
    }, SYNC_DELAY);

    return () => clearTimeout(timer);
  }, [roomId, isConnected, publish, isHost]);

  return { participants, isLoading };
};
