import type { Participant } from "@/hooks/profileview";
import type { RefObject } from "react";

export interface UseRouletteLogicProps {
  participants: Participant[];
  onResult?: (winner: Participant) => void;
}

export interface UseRouletteLogicReturn {
  isSpinning: boolean;
  winner: Participant | null;
  wheelRef: RefObject<HTMLDivElement | null>;
  spin: (winnerName: string) => void;
  getConicGradient: () => string;
}
