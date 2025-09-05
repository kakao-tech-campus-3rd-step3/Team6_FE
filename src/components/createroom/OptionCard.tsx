import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

interface OptionCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const cardStyles = {
  base: "flex h-20 w-full cursor-pointer items-center rounded-lg shadow-lg",
  selected: "bg-primary",
  unselected: "bg-white",
};

const checkStyles = {
  base: "flex h-8 w-8 items-center justify-center rounded-full bg-white",
  selected: "",
  unselected: "border-2 border-gray-300",
};

const textStyles = {
  selected: "text-white",
  unselected: "text-black",
};

export const OptionCard = ({ title, description, isSelected, onClick }: OptionCardProps) => {
  return (
    <div
      className={cn(cardStyles.base, isSelected ? cardStyles.selected : cardStyles.unselected)}
      onClick={onClick}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
    >
      <div className="flex w-1/6 items-center justify-center">
        <div className={cn(checkStyles.base, isSelected ? checkStyles.selected : checkStyles.unselected)}>
          {isSelected && <Check size={18} className="text-primary" />}
        </div>
      </div>
      <div className="w-5/6">
        <p className={cn("text-lg font-semibold", isSelected ? textStyles.selected : textStyles.unselected)}>{title}</p>
        <p className={isSelected ? textStyles.selected : textStyles.unselected}>{description}</p>
      </div>
    </div>
  );
};
