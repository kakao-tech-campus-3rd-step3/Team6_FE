import { Button } from "@/components/common";
import { Overlay } from "@/components/common/Overlay";
import { WinnerModal } from "@/components/randomroulette/WinnerModal";
import type { Participant } from "@/hooks/profileview";
import { useRouletteLogic } from "@/hooks/randomroulette/useRouletteLogic";
import { useOverlay } from "@/hooks/useOverlay";
import { RotateCwIcon } from "lucide-react";
import { useEffect } from "react";

const FULL_CIRCLE_DEGREES = 360;
const SECTION_CENTER_DIVISOR = 2;
interface RouletteProps {
  participants: Participant[];
  onResult?: (winner: Participant) => void;
}

export const Roulette = ({ participants, onResult }: RouletteProps) => {
  const { isSpinning, winner, wheelRef, spin, getConicGradient } = useRouletteLogic({ participants, onResult });

  const { isOpen, open, close } = useOverlay();

  useEffect(() => {
    if (winner && !isSpinning) {
      open();
    }
  }, [winner, isSpinning, open]);

  return (
    <section className="flex w-full flex-col items-center gap-6" aria-labelledby="roulette-title">
      <div className="relative">
        <div
          ref={wheelRef}
          className="relative h-[300px] w-[300px] rounded-full border-4 border-gray-300 bg-white shadow-lg will-change-transform"
          role="img"
          aria-label={`${participants.length}명의 참가자가 포함된 룰렛`}
          style={{
            background: `conic-gradient(${getConicGradient()})`,
          }}
        >
          {participants.map((participant, index) => {
            const sectionAngle = FULL_CIRCLE_DEGREES / participants.length;
            const rotation = sectionAngle * index + sectionAngle / SECTION_CENTER_DIVISOR;

            return (
              <div
                key={`${participant}-${index}`}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "center",
                }}
              >
                <div
                  className="absolute top-[20%] text-sm font-bold text-white transition-all duration-500"
                  style={{
                    transform: `rotate(-${rotation}deg)`,
                  }}
                >
                  {participant.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        onClick={spin}
        disabled={isSpinning || participants.length === 0}
        className="flex w-[200px] items-center justify-center gap-2 rounded-xl px-6 py-3"
      >
        <RotateCwIcon size={20} aria-hidden="true" />
        {isSpinning ? "돌리는 중..." : "룰렛 돌리기"}
      </Button>

      <Overlay isOpen={isOpen} onClose={close} title="룰렛 결과">
        {winner && <WinnerModal winner={winner} />}
      </Overlay>
    </section>
  );
};
