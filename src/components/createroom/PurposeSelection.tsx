import { useSingleSelection } from "@/hooks";

import { OptionCard } from "./OptionCard";

const purposes = [
  { id: "business", title: "공적인", description: "업무나 학업 관련 가벼운 대화" },
  { id: "personal", title: "사적인", description: "취미나 관심사에 대한 대화" },
  { id: "drinking", title: "술자리", description: "편안하고 재미있는 분위기" },
] as const;

type PurposeId = (typeof purposes)[number]["id"];

export const PurposeSelection = () => {
  const { selectItem, isSelected } = useSingleSelection<PurposeId>();

  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="text-lg font-semibold text-black">목적</legend>
        <div className="space-y-3" role="radiogroup" aria-label="방 목적 선택">
          {purposes.map((purpose) => (
            <OptionCard
              key={purpose.id}
              title={purpose.title}
              description={purpose.description}
              isSelected={isSelected(purpose.id)}
              onClick={() => selectItem(purpose.id)}
            />
          ))}
        </div>
      </fieldset>
    </section>
  );
};
