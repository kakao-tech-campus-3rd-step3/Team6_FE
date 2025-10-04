import type { Participant } from "@/components/waitingroom";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";

const SYNC_DELAY = 100;

export const useRoomParticipants = (roomId: string) => {
  const { publish, isConnected } = useStompPublish();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleParticipantMessage = useCallback((message: IMessage) => {
    try {
      const data = JSON.parse(message.body);

      if ((data.status === "SUCCESS" || data.success) && Array.isArray(data.data)) {
        setParticipants(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("[참여자 목록] 파싱 에러:", error);
      setIsLoading(false);
    }
  }, []);

  useStompSubscription(roomId ? `/topic/room-participant/${roomId}` : null, handleParticipantMessage);

  useEffect(() => {
    if (!roomId || !isConnected) {
      return;
    }

    const timer = setTimeout(() => {
      publish(`/app/room/${roomId}/participants`, {});
    }, SYNC_DELAY);

    return () => clearTimeout(timer);
  }, [roomId, isConnected, publish]);

  return { participants, isLoading };
};
