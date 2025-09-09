import { useEffect, useRef } from "react";
import { QuestionItem } from "./QuestionItem";
import { TOPIC_QUESTIONS } from "@/constants/topic-quesion";

interface QuestionListProps {
  selectedInterest: string; 
}

export const QuestionList = ({ selectedInterest }: QuestionListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const questions = TOPIC_QUESTIONS[selectedInterest] ?? [];

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedInterest]);

  return (
    <section ref={containerRef} className="space-y-4 min-h-[60vh]">
      <fieldset>
        <legend className="sr-only">추천 대화 주제</legend>
        <div className="space-y-3" role="list">
          {questions.map((q, idx) => (
            <QuestionItem
              key={q.title}
              index={idx + 1}
              title={q.title}
              description={q.description}
            />
          ))}
          {questions.length === 0 && (
            <p className="text-sm text-gray-500 px-1">
              선택한 관심사에 맞는 질문이 아직 없어요.
            </p>
          )}
        </div>
      </fieldset>
    </section>
  );
};
