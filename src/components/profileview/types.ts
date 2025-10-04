import type { Participant } from "@/hooks/profileview";

export interface ProfileCardProps {
  profile: Participant;
}

export interface PageDotsProps {
  totalCount: number;
  currentIndex: number;
}

export interface NextProfileProps {
  currentIndex: number;
  totalCount: number;
  nextProfileName: string;
}
