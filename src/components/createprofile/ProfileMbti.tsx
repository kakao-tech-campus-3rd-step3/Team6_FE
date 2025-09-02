import { Button } from "@/components/common";
import { useState } from "react";

const mbtiPairs = [
  { dimension: "EI", options: ["E", "I"] as const },
  { dimension: "SN", options: ["S", "N"] as const },
  { dimension: "TF", options: ["T", "F"] as const },
  { dimension: "JP", options: ["J", "P"] as const },
] as const;

export const ProfileMbti = () => {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleSelection = (option: string, dimension: string) => {
    setSelections((prev) => ({ ...prev, [dimension]: option }));
  };

  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="text-lg font-semibold">MBTI</legend>
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="MBTI 성격 유형 선택">
          {mbtiPairs.map((pair) =>
            pair.options.map((option, rowIndex) => (
              <Button
                key={`${pair.dimension}-${option}`}
                variant={selections[pair.dimension] === option ? "primary" : "secondary"}
                onClick={() => handleSelection(option, pair.dimension)}
                className={`${rowIndex === 1 ? "row-start-2" : ""} h-10`}
                role="radio"
                aria-checked={selections[pair.dimension] === option}
              >
                {option}
              </Button>
            )),
          )}
        </div>
      </fieldset>
    </section>
  );
};
