import { stageNavigator } from "@/services/stomp/StageNavigator";
import { useEffect, useId } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useStompConnection } from "./stomp";

export const setLastEventType = (roomId: string, eventType: string) => {
  stageNavigator.setLastEventType(roomId, eventType);
};

export const useStageNavigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams<{ roomId?: string }>();

  const roomId = params.roomId || searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";
  const { isConnected } = useStompConnection();
  const subscriberId = useId();

  useEffect(() => {
    stageNavigator.setNavigate(navigate);
    stageNavigator.setIsHost(isHost);
  }, [navigate, isHost]);

  useEffect(() => {
    if (!roomId || !isConnected) {
      return;
    }

    stageNavigator.attach(roomId, subscriberId);

    return () => {
      stageNavigator.detach(subscriberId);
    };
  }, [roomId, isConnected, subscriberId]);
};
