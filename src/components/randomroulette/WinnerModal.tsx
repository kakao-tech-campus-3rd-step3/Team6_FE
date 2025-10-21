import { RandomRouletteQuestion } from "@/components/randomroulette";
import type { Participant } from "@/hooks/profileview";

interface WinnerModalProps {
  winner: Participant;
}

export const WinnerModal = ({ winner }: WinnerModalProps) => {
  return (
    <section className="flex flex-col items-center space-y-4" aria-labelledby="winner-title">
      <header className="flex items-center justify-center gap-3">
        <div>
          <h2 id="winner-title" className="text-primary text-2xl font-bold">
            {winner.name}
          </h2>
        </div>
      </header>
      <RandomRouletteQuestion />
    </section>
  );
};
