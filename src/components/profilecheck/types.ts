import type { Participant } from "@/hooks/profileview/types";

export interface ProfileCheckReadyButtonProps {
  onReadyClick: () => void;
  isHost: boolean;
}

export interface ProfileCheckStatusProps {
  members: Participant[];
}
