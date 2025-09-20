import type { Participant } from "@/components/waitingroom";

interface ServerParticipant {
  id: number;
  name: string;
  role: "HOST" | "MEMBER";
}

export interface WaitingRoomState {
  participants: Participant[];
  maxParticipants: number;
}

export type WaitingRoomAction =
  | { type: "ROOM_INFO_UPDATE"; payload: { participants: ServerParticipant[]; room: { capacity: number } } }
  | { type: "PARTICIPANT_LIST"; payload: { participants: ServerParticipant[] } }
  | { type: "PARTICIPANT_JOINED"; payload: { newParticipant: ServerParticipant[] } }
  | { type: "USER_LEFT"; payload: { userId: number } };

const normalizeParticipant = (p: ServerParticipant): Participant => ({
  id: p.id,
  name: p.name,
  role: p.role,
});

export const waitingRoomReducer = (state: WaitingRoomState, action: WaitingRoomAction): WaitingRoomState => {
  switch (action.type) {
    case "ROOM_INFO_UPDATE": {
      const normalizedParticipants = action.payload.participants.map(normalizeParticipant);
      return {
        participants: normalizedParticipants,
        maxParticipants: action.payload.room.capacity,
      };
    }
    case "PARTICIPANT_LIST": {
      const participantList = action.payload.participants.map(normalizeParticipant);
      return {
        ...state,
        participants: participantList,
      };
    }
    case "PARTICIPANT_JOINED": {
      const newParticipants = action.payload.newParticipant.map(normalizeParticipant);
      const merged = [...state.participants, ...newParticipants];
      const uniqueParticipants = merged.filter(
        (participant, index) => merged.findIndex((p) => p.id === participant.id) === index,
      );
      return {
        ...state,
        participants: uniqueParticipants,
      };
    }
    case "USER_LEFT": {
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.payload.userId),
      };
    }
    default:
      return state;
  }
};