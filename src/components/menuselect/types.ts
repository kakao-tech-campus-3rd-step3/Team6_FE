import type { menu } from "@/constants/menu";

export type Variant = "RANDOM_ROULETTE_STAGE" | "TOPIC_RECOMMEND_STAGE" | "MANITTO_STAGE" | "ENDING_STAGE";

export interface MenuItemProps {
  variant: Variant;
  title: string;
  description: string;
  onClick: () => void;
}

export type MenuId = (typeof menu)[number]["id"];
