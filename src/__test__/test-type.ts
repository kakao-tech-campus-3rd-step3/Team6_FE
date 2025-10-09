import type { PushFunction, ReplaceFunction } from "@/services/stomp/types";

export type StageNavigatorTestType = {
  subscribers: Set<string>;
  currentRoomId: string | null;
  lastEventTypeMap: Map<string, string>;
  unsubscribeStomp: (() => void) | null;
  push: PushFunction | null;
  replace: ReplaceFunction | null;
  isHost: boolean;
};
