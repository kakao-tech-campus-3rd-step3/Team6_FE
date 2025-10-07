import { stageNavigator } from "@/services/stomp/StageNavigator";
import { useActivity, useFlow } from "@stackflow/react/future";
import { useEffect } from "react";

import { useStompConnection } from "./stomp";

export const setLastEventType = (roomId: string, eventType: string) => {
  stageNavigator.setLastEventType(roomId, eventType);
};

export const useStageNavigation = () => {
  const { push, replace } = useFlow();
  const { params } = useActivity();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const isHost = params?.isHost === "true";
  const { isConnected } = useStompConnection();

  useEffect(() => {
    stageNavigator.setFlowActions(push, replace);
    stageNavigator.setIsHost(isHost);
  }, [push, replace, isHost]);

  useEffect(() => {
    if (roomId && isConnected) {
      stageNavigator.attach(roomId);
    }

    return () => {
      stageNavigator.detach();
    };
  }, [roomId, isConnected]);
};
