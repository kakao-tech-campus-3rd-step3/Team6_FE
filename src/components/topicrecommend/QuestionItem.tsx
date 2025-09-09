import { cn } from "@/utils/cn";

interface QuestionItemProps {
  index: number; 
  title: string;
  description: string;
  onClick?: () => void;
}

const cardStyles = {
  base: "flex h-24 w-full items-center rounded-2xl shadow-lg bg-white px-4",
};

const checkStyles = {
  base: "flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-bold",
};

export const QuestionItem = ({
  index,
  title,
  description,
  onClick,
}: QuestionItemProps) => {
  return (
    <button type="button" className={cn(cardStyles.base)} onClick={onClick}>
      <div className="flex w-1/6 items-center justify-center">
        <div className={cn(checkStyles.base)}>
          {index}
        </div>
      </div>

      <div className="w-5/6 text-left pl-4">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
      </div>
    </button>
  );
};
