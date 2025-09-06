import { COLORS, COLOR_MAP } from "@/constants";
import { type RefObject, useRef, useState } from "react";

const FULL_CIRCLE_DEGREES = 360;
const SECTION_CENTER_DIVISOR = 2;
const FIXED_ROTATIONS = 10;

interface UseRouletteLogicProps {
  participants: string[];
  onResult?: (winner: string) => void;
}

interface UseRouletteLogicReturn {
  isSpinning: boolean;
  winner: string | null;
  wheelRef: RefObject<HTMLDivElement | null>;
  spin: () => void;
  getConicGradient: () => string;
}

export const useRouletteLogic = ({ participants, onResult }: UseRouletteLogicProps): UseRouletteLogicReturn => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const getConicGradient = () => {
    return participants
      .map((_, index) => {
        const color = COLORS[index % COLORS.length];
        const start = (FULL_CIRCLE_DEGREES / participants.length) * index;
        const end = (FULL_CIRCLE_DEGREES / participants.length) * (index + 1);
        return `${COLOR_MAP[color as keyof typeof COLOR_MAP]} ${start}deg ${end}deg`;
      })
      .join(", ");
  };

  const calculateSpinRotation = (winnerIndex: number) => {
    const sectionAngle = FULL_CIRCLE_DEGREES / participants.length;
    const targetAngle = sectionAngle * winnerIndex + sectionAngle / SECTION_CENTER_DIVISOR;
    return FIXED_ROTATIONS * FULL_CIRCLE_DEGREES + targetAngle;
  };

  const animateWheel = (rotation: number) => {
    if (!wheelRef.current) return;

    const fixedDuration = 3000;

    wheelRef.current.style.transition = "none";
    wheelRef.current.style.transform = "rotate(0deg)";

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    wheelRef.current.offsetHeight;

    wheelRef.current.style.transition = `transform ${fixedDuration}ms ease-out`;
    wheelRef.current.style.transform = `rotate(${rotation}deg)`;

    return fixedDuration;
  };

  const spin = () => {
    if (isSpinning || participants.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedWinner = participants[randomIndex];
    const rotation = calculateSpinRotation(randomIndex);
    const duration = animateWheel(rotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(selectedWinner);
      onResult?.(selectedWinner);
    }, duration);
  };

  return {
    isSpinning,
    winner,
    wheelRef,
    spin,
    getConicGradient,
  };
};
