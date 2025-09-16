import { INTERESTS } from "@/constants";
import type { InterestType } from "@/constants/interests";
import clsx from "clsx";

interface TopicListProps {
  selected: string;
  onSelect: (v: InterestType) => void;
}

export const TopicList = ({ selected, onSelect }: TopicListProps) => {
  return (
    <section className="space-y-4 overflow-x-hidden min-w-0">
      <fieldset className="min-w-0">
        <legend className="pb-2 text-lg font-semibold" />
        <div
          className={clsx(
            "w-full max-w-full min-w-0",
            "overflow-x-auto overflow-y-hidden",
            "overscroll-x-contain touch-pan-x",
            "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          )}
        >
          <div className="inline-flex min-w-max items-center gap-2 px-4">
            {INTERESTS.map((interest) => {
              const on = selected === interest;
              return (
                <button
                  key={interest}
                  onClick={() => onSelect(interest)}
                  aria-pressed={on}
                  className={clsx(
                    "shrink-0",
                    "h-8 px-3 rounded-full text-base",
                    "whitespace-nowrap cursor-pointer text-white",
                    on ? "bg-primary" : "bg-[#687EFF]/50"
                  )}
                >
                  #{interest}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>
    </section>
  );
};
