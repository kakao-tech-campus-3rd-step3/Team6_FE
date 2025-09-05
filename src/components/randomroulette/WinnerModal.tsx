import { RandomRouletteQuestion } from "@/components/randomroulette";
import { UserStar } from "lucide-react";

interface WinnerModalProps {
  winner: string;
}

export const WinnerModal = ({ winner }: WinnerModalProps) => {
  return (
    <section className="flex flex-col items-center space-y-4" aria-labelledby="winner-title">
      <header className="flex items-center justify-center gap-3">
        <div
          className="bg-primary flex items-center justify-center rounded-full p-3"
          role="img"
          aria-label="우승자 아이콘"
        >
          <UserStar size={28} color="white" aria-hidden="true" />
        </div>
        <div>
          <h2 id="winner-title" className="text-primary text-2xl font-bold">
            {winner}
          </h2>
        </div>
      </header>
      <RandomRouletteQuestion />
    </section>
  );
};
