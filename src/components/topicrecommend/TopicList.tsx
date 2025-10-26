import type { TopicListProps } from "@/components/topicrecommend/types";
import clsx from "clsx";

export const TopicList = ({ topics, selected, onSelect }: TopicListProps) => {
  return (
    <section className="min-w-0 space-y-4 overflow-x-hidden">
      <fieldset className="min-w-0">
        <legend className="pb-2 text-lg font-semibold" />
        <div
          className={clsx(
            "w-full max-w-full min-w-0",
            "overflow-x-auto overflow-y-hidden",
            "touch-pan-x overscroll-x-contain",
            "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100",
          )}
        >
          <div className="inline-flex min-w-max items-center gap-2 px-4">
            {topics.map((topic) => {
              const on = selected === topic;
              return (
                <button
                  key={topic.name}
                  onClick={() => onSelect(topic)}
                  aria-pressed={on}
                  className={clsx(
                    "shrink-0",
                    "h-8 rounded-full px-3 text-base",
                    "cursor-pointer whitespace-nowrap text-white",
                    on ? "bg-primary" : "bg-[#687EFF]/50",
                  )}
                >
                  #{topic.name}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>
    </section>
  );
};
