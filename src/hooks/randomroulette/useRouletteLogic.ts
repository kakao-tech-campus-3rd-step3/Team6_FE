import { COLORS, COLOR_MAP } from "@/constants";
import type { Participant } from "@/hooks/profileview";
import type { UseRouletteLogicProps, UseRouletteLogicReturn } from "@/hooks/randomroulette/types";
import { useCallback, useRef, useState } from "react";

const FULL_CIRCLE_DEGREES = 360;
const SECTION_CENTER_DIVISOR = 2;
const FIXED_ROTATIONS = 10;

export const useRouletteLogic = ({ participants, onResult }: UseRouletteLogicProps): UseRouletteLogicReturn => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
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

  const calculateSpinRotation = useCallback(
    (winnerIndex: number) => {
      const sectionAngle = FULL_CIRCLE_DEGREES / participants.length;
      const targetAngle = sectionAngle * winnerIndex + sectionAngle / SECTION_CENTER_DIVISOR;
      return FIXED_ROTATIONS * FULL_CIRCLE_DEGREES + targetAngle;
    },
    [participants.length],
  );

  const animateWheel = useCallback((rotation: number) => {
    if (!wheelRef.current) return;

    const fixedDuration = 3000;

    wheelRef.current.style.transition = "none";
    wheelRef.current.style.transform = "rotate(0deg)";

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    wheelRef.current.offsetHeight;

    wheelRef.current.style.transition = `transform ${fixedDuration}ms ease-out`;
    wheelRef.current.style.transform = `rotate(${rotation}deg)`;

    return fixedDuration;
  }, []);

  const spin = useCallback(
    (winnerName: string) => {
      if (isSpinning || participants.length === 0) {
        return;
      }

      setIsSpinning(true);
      setWinner(null);
      // TODO : 백엔드에서 userId값 넘겨달라고 하기
      const winnerIndex = participants.findIndex((p) => p.name === winnerName);

      if (winnerIndex === -1) {
        console.error("[Roulette] 당첨자를 찾을 수 없습니다:", winnerName);
        setIsSpinning(false);
        return;
      }

      const selectedWinner = participants[winnerIndex];
      const rotation = calculateSpinRotation(winnerIndex);
      const duration = animateWheel(rotation);

      setTimeout(() => {
        setIsSpinning(false);
        setWinner(selectedWinner);
        onResult?.(selectedWinner);
      }, duration);
    },
    [isSpinning, participants, onResult, calculateSpinRotation, animateWheel],
  );

  return {
    isSpinning,
    winner,
    wheelRef,
    spin,
    getConicGradient,
  };
};
