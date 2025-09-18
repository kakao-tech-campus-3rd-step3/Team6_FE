import type { Participant } from "@/components/waitingroom/types";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";

interface UseWaitingRoomDataProps {
  roomId: string;
  isHost: boolean;
}

interface ServerParticipant {
  id: number;
  name: string;
  role: "HOST" | "MEMBER";
}
const EMPTY_OPTIONS = {};

export const useWaitingRoomData = ({ roomId, isHost }: UseWaitingRoomDataProps) => {
  const { publish, isConnected } = useStompPublish();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [maxParticipants, setMaxParticipants] = useState<number>(0);

  const normalizeParticipant = useCallback(
    (p: ServerParticipant): Participant => ({
      id: p.id,
      name: p.name,
      role: p.role,
    }),
    [],
  );

  const handleRoomMessage = useCallback(
    (message: IMessage) => {
      console.log(`방 ${roomId} 메시지:`, message.body);
      try {
        const data = JSON.parse(message.body);
        const payload = data.data?.payload || data.payload || data;
        console.log(payload);

        if (payload.room && Array.isArray(payload.participants)) {
          console.log("전체 방 정보 업데이트:", payload);
          const normalizedParticipants = payload.participants.map(normalizeParticipant);
          setParticipants(normalizedParticipants);
          setMaxParticipants(payload.room.capacity);
          return;
        }

        if (payload.type === "PARTICIPANT_LIST" || payload.participants) {
          const participantList = (payload.participants || []).map(normalizeParticipant);
          console.log("참가자 목록 업데이트:", participantList);
          setParticipants(participantList);
          return;
        }

        if (payload.type === "PARTICIPANT_JOINED" && payload.newParticipant) {
          console.log("PARTICIPANT_JOINED - 새 참가자 추가:", payload.newParticipant);
          const newParticipants = payload.newParticipant.map(normalizeParticipant);

          setParticipants((prev) => {
            const merged = [...prev, ...newParticipants];
            const uniqueParticipants = merged.filter(
              (participant, index) => merged.findIndex((p) => p.id === participant.id) === index,
            );
            return uniqueParticipants;
          });
          return;
        }

        if (payload.type === "USER_LEFT" && payload.userId) {
          console.log("참가자 퇴장:", payload.userId);
          setParticipants((prev) => prev.filter((p) => p.id !== payload.userId));
          return;
        }
      } catch (error) {
        console.error(`방 ${roomId} 메시지 파싱 오류:`, error);
      }
    },
    [roomId, normalizeParticipant],
  );

  const handleErrorMessage = useCallback((message: IMessage) => {
    console.error("에러:", message.body);
  }, []);

  const { isSubscribed: roomSubscribed } = useStompSubscription(
    roomId ? `/topic/waiting-room/${roomId}` : null,
    handleRoomMessage,
    EMPTY_OPTIONS,
  );

  useStompSubscription("/user/queue/errors", handleErrorMessage, EMPTY_OPTIONS);

  useEffect(() => {
    if (roomId && !isHost && isConnected) {
      publish(`/app/waiting-room/${roomId}/join`, {});
      console.log(`[참여자] 방 ${roomId} 참여 요청 전송`);
    }
  }, [roomId, isHost, isConnected, publish]);

  return {
    participants,
    maxParticipants,
    isConnected,
    roomSubscribed,
  };
};
