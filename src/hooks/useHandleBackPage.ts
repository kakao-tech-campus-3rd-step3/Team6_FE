import { useStompPublish } from "@/hooks/stomp";
import { setLastEventType } from "@/hooks/useStageNavigation";
import { useActivity } from "@stackflow/react/future";

export const useHandleBackPage = () => {
  const { publish } = useStompPublish();
  const { params } = useActivity();

  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const isHost = params?.isHost === "true";

  const handleBack = () => {
    if (!isHost || !roomId) return;

    setLastEventType(roomId, "PREV");
    publish(`/app/room/${roomId}/change-stage`, {
      eventType: "PREV",
    });
  };

  return handleBack;
};
