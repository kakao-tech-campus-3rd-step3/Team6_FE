import type { NavigateFn } from "@/services/stomp/types";

export type StageNavigatorTestType = {
  subscribers: Set<string>;
  currentRoomId: string | null;
  lastEventTypeMap: Map<string, string>;
  unsubscribeStomp: (() => void) | null;
  navigate: NavigateFn | null;
  isHost: boolean;
};
