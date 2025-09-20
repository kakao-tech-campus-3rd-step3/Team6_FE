export interface Participant {
  id: number;
  name: string;
  role: 'HOST' | 'MEMBER';
}

export interface WaitingRoomParticipantsProps {
  participants: Participant[];
  maxParticipants: number;
}

export interface ProgressBarProps {
  current: number;
  capacity: number;
}

export interface ParticipantItemProps {
  participant: Participant;
}

export interface WaitingRoomCodeProps {
  roomId?: string;
}
