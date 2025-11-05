import type { QuestionListProps } from "@/components/topicrecommend/types";
import type { InterestType } from "@/constants/interests";
import { useEffect, useRef } from "react";

import { QuestionItem } from "./QuestionItem";

export const QuestionList = ({ questions, selectedInterest }: QuestionListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevInterestRef = useRef<InterestType | undefined>(selectedInterest);

  useEffect(() => {
    if (prevInterestRef.current && selectedInterest && prevInterestRef.current !== selectedInterest) {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevInterestRef.current = selectedInterest;
  }, [selectedInterest]);

  return (
    <section ref={containerRef} className="min-h-[60vh] space-y-4">
      <fieldset>
        <legend className="sr-only">추천 대화 주제</legend>
        <div className="space-y-3" role="list">
          {questions.map((q, idx) => (
            <QuestionItem key={q.content} index={idx + 1} title={q.content} description={""} />
          ))}
          {questions.length === 0 && (
            <p className="px-1 text-sm text-gray-500">선택한 관심사에 맞는 질문이 아직 없어요.</p>
          )}
        </div>
      </fieldset>
    </section>
  );
};
