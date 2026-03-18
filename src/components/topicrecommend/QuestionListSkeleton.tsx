import { QuestionItemSkeleton } from "./QuestionItemSkeleton";

export const QuestionListSkeleton = () => {
  return (
    <section className="min-h-[60vh] space-y-4">
      <fieldset>
        <legend className="sr-only">추천 대화 주제</legend>
        <div className="space-y-3" role="list">
          {Array.from({ length: 5 }).map((_, index) => (
            <QuestionItemSkeleton key={index} />
          ))}
        </div>
      </fieldset>
    </section>
  );
};
