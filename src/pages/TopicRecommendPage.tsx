import { IntroSection, QuestionList, TopicList } from "@/components/topicrecommend";
import { INTERESTS, type InterestType } from "@/constants/interests";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";

const TopicRecommendPage: ActivityComponentType<"TopicRecommendPage"> = () => {
  const [selected, setSelected] = useState<InterestType>(INTERESTS[0]);
  useStageNavigation();
  const handleBack = useHandleBackPage();
  return (
    <AppScreen
      appBar={{
        title: "주제 추천",
        backButton: {
          onClick: () => {
            handleBack();
          },
        },
      }}
    >
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <TopicList selected={selected} onSelect={setSelected} />
        <IntroSection />
        <QuestionList selectedInterest={selected} />
      </main>
    </AppScreen>
  );
};

export default TopicRecommendPage;
