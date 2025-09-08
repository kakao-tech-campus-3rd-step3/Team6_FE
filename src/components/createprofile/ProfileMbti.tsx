import { Button } from "@/components/common";
import { mbtiPairs } from "@/constants";
import { useMbti } from "@/hooks/users";
import type { MBTI } from "@/types/mbti";

interface ProfileMbtiProps {
  mbti: MBTI | "";
  onMbtiChange: (mbti: MBTI | "") => void;
}

export const ProfileMbti = ({ mbti, onMbtiChange }: ProfileMbtiProps) => {
  const { handleSelection, isSelected } = useMbti(mbti, onMbtiChange);

  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="pb-2 text-lg font-semibold">MBTI</legend>
        <div className="grid grid-cols-4 gap-2">
          {mbtiPairs.map((pair) => (
            <div key={pair.dimension} role="radiogroup" aria-label={`${pair.dimension} 선택`} className="contents">
              {pair.options.map((option, rowIndex) => (
                <Button
                  key={`${pair.dimension}-${option}`}
                  variant={isSelected(option, pair.dimension) ? "main" : "sub"}
                  onClick={() => handleSelection(option, pair.dimension)}
                  className={`${rowIndex === 1 ? "row-start-2" : ""} h-10`}
                  role="radio"
                  aria-checked={isSelected(option, pair.dimension)}
                >
                  {option}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </fieldset>
    </section>
  );
};
