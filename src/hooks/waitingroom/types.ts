export interface Participant {
  id: number;
  name: string;
  role: "HOST" | "MEMBER";
}

interface WaitingRoomInfo {
  roomId: string;
  name: string;
  capacity: number;
  hostId: number;
}

interface WaitingRoomPayload {
  status: "AVAILABLE" | "FULL";
  room: WaitingRoomInfo;
  participants: Participant[];
}

interface WaitingRoomData {
  type: "PARTICIPANT_JOINED" | "PARTICIPANT_LIST" | "USER_LEFT";
  payload: WaitingRoomPayload & {
    newParticipant?: Participant;
    userId?: number;
  };
}

export interface WaitingRoomState {
  participants: Participant[];
  maxParticipants: number;
}

export interface UseWaitingRoomDataProps {
  roomId: string;
  isHost: boolean;
}

export type WaitingRoomResponse = BaseResponse<WaitingRoomData>;
