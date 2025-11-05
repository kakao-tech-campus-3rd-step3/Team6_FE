interface IntroSectionProps {
  topic: string;
}

export const IntroSection = ({ topic = "" }: IntroSectionProps) => {
  const intro = {
    topic: topic === "" ? "공통 주제" : topic,

    description: topic === "" ? "공통 관심사를 바탕으로 준비했어요" : `${topic} 주제에 맞춰 질문을 준비했어요`,
  };
  return (
    <div className="flex flex-col items-center justify-center px-6 py-6 text-center">
      <p className="mb-2 text-xl font-bold text-gray-900">{intro.topic}</p>
      <p className="text-sm text-gray-500">{intro.description}</p>
    </div>
  );
};
