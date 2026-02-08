import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { useUserStore } from "@/store/useUserStore";
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

  const roomParticipants = useUserStore((state) => state.setParticipants);
  const handleParticipantMessage = useCallback(
    (response: RoomParticipantResponse) => {
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
