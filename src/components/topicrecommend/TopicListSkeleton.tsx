import clsx from "clsx";

export const TopicListSkeleton = () => {
  return (
    <section className="min-w-0 space-y-4 overflow-x-hidden">
      <fieldset className="min-w-0">
        <legend className="pb-2 text-lg font-semibold" />
        <div
          className={clsx(
            "w-full max-w-full min-w-0",
            "overflow-x-auto overflow-y-hidden",
            "touch-pan-x overscroll-x-contain",
            "hide-scrollbar",
          )}
        >
          <div className="inline-flex min-w-max items-center gap-2 px-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-gray-200"
              />
            ))}
          </div>
        </div>
      </fieldset>
    </section>
  );
};
