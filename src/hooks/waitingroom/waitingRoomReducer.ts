import type { Participant } from "@/components/waitingroom";
import type { WaitingRoomState } from "@/hooks/waitingroom/types";

export type WaitingRoomAction =
  | { type: "ROOM_INFO_UPDATE"; payload: { participants: Participant[]; room: { capacity: number } } }
  | { type: "PARTICIPANT_LIST"; payload: { participants: Participant[] } }
  | { type: "PARTICIPANT_JOINED"; payload: { newParticipant: Participant } }
  | { type: "USER_LEFT"; payload: { userId: number } };

const normalizeParticipant = (p: Participant): Participant => ({
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
      const newParticipant = normalizeParticipant(action.payload.newParticipant);

      const exists = state.participants.some((p) => p.id === newParticipant.id);
      if (exists) {
        return state;
      }

      return {
        ...state,
        participants: [...state.participants, newParticipant],
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
