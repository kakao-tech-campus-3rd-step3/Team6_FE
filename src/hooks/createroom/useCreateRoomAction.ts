import type { CreateRoomActionReturn, CreateRoomFormData } from "@/hooks/createroom";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { useFlow } from "@stackflow/react/future";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";

const EMPTY_OPTIONS = {};

export const useCreateRoomAction = (formData: CreateRoomFormData, isFormValid: boolean): CreateRoomActionReturn => {
  const { push } = useFlow();
  const { publish, isConnected } = useStompPublish();
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);

  const handleWaitingRoomMessage = useCallback((message: IMessage) => {
    try {
      console.log("대기실 메시지 원본:", message.body);
      const data = JSON.parse(message.body);
      console.log("방 생성 응답 받음:", data);

      const newRoomId = data?.data?.roomId || data?.roomId;

      if (newRoomId && data.success) {
        console.log("방 생성 성공, Room ID:", newRoomId);
        setCreatedRoomId(newRoomId);
      } else {
        console.warn("roomId가 없거나 요청 실패:", data);
        setIsCreating(false);
      }
    } catch (error) {
      console.error("방 생성 응답 처리 오류:", error);
      setIsCreating(false);
    }
  }, []);

  const handleErrorMessage = useCallback((message: IMessage) => {
    console.error("서버 에러 수신:", message.body);
    setIsCreating(false);
  }, []);

  const { isSubscribed: waitingRoomSubscribed } = useStompSubscription(
    "/user/queue/waiting-room",
    handleWaitingRoomMessage,
    EMPTY_OPTIONS,
  );

  const { isSubscribed: errorSubscribed } = useStompSubscription(
    "/user/queue/errors",
    handleErrorMessage,
    EMPTY_OPTIONS,
  );

  useEffect(() => {
    if (createdRoomId) {
      push("WaitingRoomPage", {
        roomId: createdRoomId,
        isHost: "true",
      });

      setCreatedRoomId(null);
      setIsCreating(false);
    }
  }, [createdRoomId, push]);

  const handleCreateRoom = useCallback(async () => {
    if (!isConnected || isCreating || !isFormValid) {
      console.warn("방 생성 조건 불충족:", { isConnected, isCreating, isFormValid });
      return;
    }

    console.log("방 생성 요청 시작");
    setIsCreating(true);

    try {
      const payload = {
        name: formData.roomName,
        capacity: formData.capacity,
      };

      console.log("방 생성 요청:", payload);

      const success = await publish("/app/waiting-room/create", payload);

      if (success) {
        console.log("방 생성 요청 전송됨");
      } else {
        console.error("메시지 발송 실패 (클라이언트 측)");
        setIsCreating(false);
      }
    } catch (error) {
      console.error("방 생성 요청 중 예외 발생:", error);
      setIsCreating(false);
    }
  }, [isConnected, isCreating, isFormValid, formData.roomName, formData.capacity, publish]);

  const isReady = isConnected && waitingRoomSubscribed && errorSubscribed;

  return {
    isCreating,
    isReady,
    handleCreateRoom,
  };
};
