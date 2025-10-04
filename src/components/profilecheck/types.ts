import type { MBTI } from "@/types/mbti";

export interface ProfileCheckReadyButtonProps {
  onReadyClick: () => void;
  isHost: boolean;
}

export interface Member {
  id: number;
  name: string;
  age: number;
  mbtiType: MBTI;
  interests: string[];
  introduction: string;
}

export interface ProfileCheckStatusProps {
  members: Member[];
}
