import type { Participant } from "@/hooks/profileview";

export interface WinnerModalProps {
  winner: Participant;
  question?: string;
}

export interface GameResult {
  userName: string;
  question: {
    content: string;
  };
}

export interface RouletteProps {
  participants: Participant[];
  onResult?: (winner: Participant) => void;
  gameResult?: GameResult | null;
  isHost?: boolean;
  onStartGame?: () => void;
}

export interface RandomRouletteQuestionProps {
  question?: string;
}
