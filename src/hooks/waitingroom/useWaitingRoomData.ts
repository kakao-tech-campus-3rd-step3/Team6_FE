import type { Participant } from "@/components/waitingroom/types";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";

interface UseWaitingRoomDataProps {
  roomId: string;
  isHost: boolean;
}
const TEMP_MAX_PARTICIPANTS = 4;
const EMPTY_OPTIONS = {};

export const useWaitingRoomData = ({ roomId, isHost }: UseWaitingRoomDataProps) => {
  const { publish, isConnected } = useStompPublish();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [maxParticipants, setMaxParticipants] = useState(TEMP_MAX_PARTICIPANTS);

  const normalizeParticipant = useCallback(
    (p: Participant): Participant => ({
      ...p,
      userId: String(p.userId),
      isJoined: p.isJoined ?? true,
    }),
    [],
  );

  const handleRoomMessage = useCallback(
    (message: IMessage) => {
      console.log(`방 ${roomId} 메시지:`, message.body);
      try {
        const data = JSON.parse(message.body);
        const roomData = data.data || data;
        console.log(roomData);
        if (roomData.participants && roomData.capacity) {
          console.log("전체 방 정보 업데이트:", roomData);
          const normalizedParticipants = roomData.participants.map(normalizeParticipant);
          setParticipants(normalizedParticipants);
          setMaxParticipants(roomData.capacity);
          return;
        }

        if (roomData.type === "PARTICIPANT_LIST" || roomData.participants) {
          const participantList = (roomData.participants || []).map(normalizeParticipant);
          console.log("참가자 목록 업데이트:", participantList);
          setParticipants(participantList);
          return;
        }

        if (roomData.type === "USER_JOINED" && roomData.participant) {
          console.log("새 참가자 참여:", roomData.participant);
          const newParticipant = normalizeParticipant(roomData.participant);
          setParticipants((prev) => {
            const exists = prev.some((p) => p.userId === newParticipant.userId);
            return exists ? prev : [...prev, newParticipant];
          });
          return;
        }

        if (roomData.type === "USER_LEFT" && roomData.userId) {
          console.log("참가자 퇴장:", roomData.userId);
          setParticipants((prev) => prev.filter((p) => p.userId !== String(roomData.userId)));
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
    if (roomSubscribed && isHost) {
      console.log(`[방장] 방(${roomId}) 구독 성공. 현재 방 정보 요청 중`);
      publish(`/app/waiting-room/${roomId}/info`, {});
    }
  }, [roomSubscribed, isHost, roomId, publish]);

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
