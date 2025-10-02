import type { CreateRoomActionReturn, CreateRoomFormData } from "@/hooks/createroom";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { useFlow } from "@stackflow/react/future";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";

export const useCreateRoomAction = (formData: CreateRoomFormData, isFormValid: boolean): CreateRoomActionReturn => {
  const { push } = useFlow();
  const { publish, isConnected } = useStompPublish();
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [shouldSubscribe, setShouldSubscribe] = useState(true);

  const handleWaitingRoomMessage = useCallback((message: IMessage) => {
    try {
      const data = JSON.parse(message.body);

      const newRoomId = data?.data?.roomId || data?.roomId;

      if (newRoomId && data.success) {
        setCreatedRoomId(newRoomId);
        setShouldSubscribe(false);
      } else {
        setIsCreating(false);
      }
    } catch {
      setIsCreating(false);
    }
  }, []);

  useStompSubscription(shouldSubscribe ? "/user/queue/waiting-room" : null, handleWaitingRoomMessage);

  const isReady = isConnected;

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
    if (!isReady || isCreating || !isFormValid) {
      return;
    }

    setIsCreating(true);

    try {
      const payload = {
        name: formData.roomName,
        capacity: formData.capacity,
      };

      const success = await publish("/app/waiting-room/create", payload);

      if (success) {
        console.log("방 생성 요청 전송됨");
      } else {
        setIsCreating(false);
      }
    } catch {
      setIsCreating(false);
    }
  }, [isReady, isCreating, isFormValid, formData.roomName, formData.capacity, publish]);

  return {
    isCreating,
    isReady,
    handleCreateRoom,
  };
};
