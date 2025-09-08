import { INTERESTS } from "@/constants";
import clsx from "clsx";
import { useState } from "react";

export const TopicList = () => {
  const [selected, setSelected] = useState<string>(INTERESTS[0]);
  return (
    <section className="space-y-4 overflow-x-hidden min-w-0">
      <fieldset className="min-w-0">
        <legend className="pb-2 text-lg font-semibold"></legend>
        <div
          className={clsx(
            "w-full",
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
                  onClick={() => setSelected(interest)}
                  aria-pressed={on}
                  className={clsx(
                    "shrink-0",
                    "h-8 px-3 rounded-full text-base",
                    "whitespace-nowrap cursor-pointer text-white",
                    on ? "bg-primary" : "bg-[#687EFF]/50"
                  )}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>
    </section>
  );
};
