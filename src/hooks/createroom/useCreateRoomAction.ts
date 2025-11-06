import type { CreateRoomActionReturn } from "@/hooks/createroom";
import type { CreateRoomResponse } from "@/hooks/createroom/types";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import type { CreateRoomFormSchemaType } from "@/model/CreateRoomFormSchema";
import { getMessageBody } from "@/utils/stomp/getMessageBody";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useCreateRoomAction = (
  formData: Pick<CreateRoomFormSchemaType, "roomName" | "capacity">,
  isFormValid: boolean,
): CreateRoomActionReturn => {
  const navigate = useNavigate();
  const { publish, isConnected } = useStompPublish();
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [shouldSubscribe, setShouldSubscribe] = useState(true);

  const handleWaitingRoomMessage = useCallback((message: IMessage) => {
    const response = getMessageBody<CreateRoomResponse>(message);

    if (!response) {
      setIsCreating(false);
      return;
    }

    const newRoomId = response.data?.roomId;

    if (newRoomId && response.success) {
      setCreatedRoomId(newRoomId);
      setShouldSubscribe(false);
    } else {
      setIsCreating(false);
    }
  }, []);

  useStompSubscription(shouldSubscribe ? "/user/queue/waiting-room" : null, handleWaitingRoomMessage);

  const isReady = isConnected;

  useEffect(() => {
    if (createdRoomId) {
      navigate(`/waiting-room/${createdRoomId}?isHost=true`);

      setCreatedRoomId(null);
      setIsCreating(false);
    }
  }, [createdRoomId, navigate]);

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
        //TODO
      } else {
        setIsCreating(false);
      }
    } catch {
      setIsCreating(false);
      setShouldSubscribe(true);
    }
  }, [isReady, isCreating, isFormValid, formData.roomName, formData.capacity, publish]);

  return {
    isCreating,
    isReady,
    handleCreateRoom,
  };
};
