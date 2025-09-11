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

        if (roomData.type === "PARTICIPANT_JOINED" && roomData.newParticipant) {
          console.log("PARTICIPANT_JOINED - 참가자 목록 업데이트:", roomData.newParticipant);
          const participantList = roomData.newParticipant.map((p: ServerParticipant) =>
            normalizeParticipant({
              userId: String(p.id),
              name: p.name,
              isJoined: true,
            }),
          );

          const uniqueParticipants = participantList.filter(
            (participant: Participant, index: number, array: Participant[]) =>
              array.findIndex((p: Participant) => p.userId === participant.userId) === index,
          );

          console.log("중복 제거 후 참가자 목록:", uniqueParticipants);
          setParticipants(uniqueParticipants);
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
