import type { StompError } from "@/errors/stomp-errors";
import type { NavigateFunction } from "react-router-dom";

export interface StompState {
  isConnected: boolean;
  isConnecting: boolean;
  error: StompError | null;
}
interface RoomChangeData {
  stage: string;
}
export type RoomChangeResponse = BaseResponse<RoomChangeData>;

export type StateListener = (state: StompState) => void;

export type Unsubscribe = () => void;

export type NavigateFn = NavigateFunction;
