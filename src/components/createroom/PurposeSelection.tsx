import { type PurposeId, ROOM_PURPOSE } from "@/constants";

import { OptionCard } from "./OptionCard";

interface PurposeSelectionProps {
  selectedPurpose: PurposeId | "";
  onPurposeChange: (purpose: PurposeId) => void;
}

export const PurposeSelection = ({ selectedPurpose, onPurposeChange }: PurposeSelectionProps) => {
  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="pb-2 text-lg font-semibold text-black">목적</legend>
        <div className="space-y-3" role="radiogroup" aria-label="방 목적 선택">
          {ROOM_PURPOSE.map((purpose) => (
            <OptionCard
              key={purpose.id}
              title={purpose.title}
              description={purpose.description}
              isSelected={selectedPurpose === purpose.id}
              onClick={() => onPurposeChange(purpose.id)}
            />
          ))}
        </div>
      </fieldset>
    </section>
  );
};
