import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
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

  const handleParticipantMessage = useCallback((message: IMessage) => {
    try {
      const response = JSON.parse(message.body) as RoomParticipantResponse;

      if (response.success && Array.isArray(response.data)) {
        setParticipants(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("참여자 목록 파싱 실패:", error);
      setIsLoading(false);
    }
  }, []);

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
