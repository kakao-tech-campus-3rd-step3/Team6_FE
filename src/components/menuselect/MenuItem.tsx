import type { MenuItemProps, Variant } from "@/components/menuselect/types";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, CircleHelp, Lightbulb, RotateCcw, Users } from "lucide-react";

const iconMap: Record<Variant, LucideIcon> = {
  RANDOM_ROULETTE_STAGE: CircleHelp,
  TOPIC_RECOMMEND_STAGE: Lightbulb,
  MANITTO_STAGE: Users,
  ENDING_STAGE: RotateCcw,
};

const cardStyles = {
  base: "flex h-24 w-full cursor-pointer items-center rounded-2xl shadow-lg bg-white",
};

const checkStyles = {
  base: "flex h-11 w-11 items-center justify-center rounded-full bg-primary",
};

export const MenuItem = ({ variant, title, description, onClick }: MenuItemProps) => {
  const Icon = iconMap[variant];

  return (
    <button type="button" className={cn(cardStyles.base)} onClick={onClick}>
      <div className="flex w-1/6 items-center justify-center pl-4">
        <div className={cn(checkStyles.base)}>
          <Icon size={22} className="text-white" />
        </div>
      </div>

      <div className="w-5/6 pl-4 text-left">
        <p className="text-xl font-semibold">{title}</p>
        <p className="text-gray-500">{description}</p>
      </div>

      <ChevronRight className="mr-4 h-5 w-5 text-gray-300" aria-hidden />
    </button>
  );
};
