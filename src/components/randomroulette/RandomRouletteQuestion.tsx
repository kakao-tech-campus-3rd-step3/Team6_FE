import { DEFAULT_QUESTIONS } from "@/constants";
import { MessageSquareQuoteIcon } from "lucide-react";

interface RandomRouletteQuestionProps {
  question?: string;
}

export const RandomRouletteQuestion = ({ question }: RandomRouletteQuestionProps) => {
  const displayQuestion = question || DEFAULT_QUESTIONS[Math.floor(Math.random() * DEFAULT_QUESTIONS.length)];

  return (
    <section
      className="animate-in slide-in-from-bottom p-4delay-300 mt-4 w-full rounded-xl bg-white duration-500"
      aria-labelledby="question-title"
      role="complementary"
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="bg-primary rounded-full p-2" aria-hidden="true">
          <MessageSquareQuoteIcon size={16} color="white" />
        </div>
        <h3 id="question-title" className="text-xl font-bold text-gray-800">
          질문
        </h3>
        <p className="max-w-md text-center text-base leading-relaxed font-medium" role="note" aria-live="polite">
          {displayQuestion}
        </p>
      </div>
    </section>
  );
};
