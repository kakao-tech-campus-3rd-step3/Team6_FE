import type { InterestType } from "@/constants";

export interface QuestionItemProps {
  index: number;
  title: string;
  description: string;
  onClick?: () => void;
}

export interface QuestionListProps {
  questions: Questions[];
  selectedInterest?: InterestType;
}

export interface Questions {
  content: string;
}

export interface TopicListProps {
  topics: Category[];
  selected: Category | undefined;
  onSelect: (v: Category) => void;
}

export interface Category {
  name: InterestType;
}
