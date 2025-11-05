import { useStompPublish } from "@/hooks/stomp";
import { setLastEventType } from "@/hooks/useStageNavigation";
import { useSearchParams } from "react-router-dom";

export const useHandleBackPage = () => {
  const { publish } = useStompPublish();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";

  const canGoBack = isHost && !!roomId;

  const handleBack = () => {
    if (!canGoBack) return;

    setLastEventType(roomId, "PREV");
    publish(`/app/room/${roomId}/change-stage`, {
      eventType: "PREV",
    });
  };

  return { handleBack, canGoBack };
};
