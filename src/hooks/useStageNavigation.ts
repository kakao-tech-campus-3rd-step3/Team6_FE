import { stageNavigator } from "@/services/stomp/StageNavigator";
import { useActivity, useFlow } from "@stackflow/react/future";
import { useEffect, useId } from "react";

import { useStompConnection } from "./stomp";

export const setLastEventType = (roomId: string, eventType: string) => {
  stageNavigator.setLastEventType(roomId, eventType);
};

export const useStageNavigation = () => {
  const { push, replace } = useFlow();
  const { params, isActive } = useActivity();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const isHost = params?.isHost === "true";
  const { isConnected } = useStompConnection();
  const subscriberId = useId();

  useEffect(() => {
    stageNavigator.setFlowActions(push, replace);
    stageNavigator.setIsHost(isHost);
  }, [push, replace, isHost]);

  useEffect(() => {
    if (!roomId || !isConnected || !isActive) return;

    stageNavigator.attach(roomId, subscriberId);

    return () => {
      stageNavigator.detach(subscriberId);
    };
  }, [roomId, isConnected, isActive, subscriberId]);
};
