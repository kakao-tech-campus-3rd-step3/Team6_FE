export interface Participant {
  userId: string;
  name: string;
  isJoined: boolean;
}

export interface WaitingRoomParticipantsProps {
  participants: Participant[];
  maxParticipants: number;
}

export interface ProgressBarProps {
  current: number;
  max: number;
}

export interface ParticipantItemProps {
  participant: Participant;
}

export interface WaitingRoomCodeProps {
  roomId?: string;
}
