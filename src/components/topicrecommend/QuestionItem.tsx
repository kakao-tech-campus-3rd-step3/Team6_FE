import type { QuestionItemProps } from "@/components/topicrecommend/types";
import { cn } from "@/utils/cn";

const cardStyles = {
  base: "flex h-24 w-full items-center rounded-2xl shadow-lg bg-white px-4",
};

const checkStyles = {
  base: "flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-bold",
};

export const QuestionItem = ({ index, title, description, onClick }: QuestionItemProps) => {
  return (
    <button type="button" className={cn(cardStyles.base)} onClick={onClick} aria-label={`질문 ${index}: ${title}`}>
      <div className="flex w-1/6 items-center justify-center">
        <div className={cn(checkStyles.base)} aria-hidden="true">
          {index}
        </div>
      </div>

      <div className="w-5/6 pl-4 text-left">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );
};
