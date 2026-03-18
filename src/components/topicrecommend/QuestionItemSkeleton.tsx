import { cn } from "@/utils/cn";

const cardStyles = {
  base: "flex h-24 w-full items-center rounded-2xl shadow-lg bg-white px-4 animate-pulse",
};

const checkStyles = {
  base: "flex h-11 w-11 items-center justify-center rounded-full bg-gray-200",
};

export const QuestionItemSkeleton = () => {
  return (
    <div className={cn(cardStyles.base)}>
      <div className="flex w-1/6 items-center justify-center">
        <div className={cn(checkStyles.base)} />
      </div>

      <div className="w-5/6 space-y-2 pl-4">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
};
