import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { CircleHelp, Lightbulb, Users, RotateCcw, ChevronRight } from "lucide-react";

type Variant = "random" | "topic" | "manitto" | "end";

const iconMap: Record<Variant, LucideIcon> = {
  random: CircleHelp,
  topic: Lightbulb,
  manitto: Users,
  end: RotateCcw,
};

interface MenuItemProps {
  variant: Variant;
  title: string;
  description: string;
  onClick: () => void;
}

const cardStyles = { 
  base: "flex h-25 w-full cursor-pointer items-center rounded-2xl shadow-lg bg-white", 
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
          <Icon size={22} className="text-white"/>
        </div>
      </div>

      <div className="w-5/6 text-left pl-4">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-gray-500">{description}</p>
      </div>

      <ChevronRight className="h-5 w-5 text-gray-300 mr-4" aria-hidden />
    </button>
  );
};
