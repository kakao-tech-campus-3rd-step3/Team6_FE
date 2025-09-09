import { IntroSection, QuestionList, TopicList} from "@/components/topicrecommend";
import { INTERESTS } from "@/constants/interests";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";
import { useState } from "react";

const TopicRecommendPage: ActivityComponentType = () => {
  const [selected, setSelected] = useState<string>(INTERESTS[0]);

  return (
    <AppScreen appBar={{ title: "주제 추천" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <TopicList selected={selected} onSelect={setSelected} />
        <IntroSection />
        <QuestionList selectedInterest={selected} />
      </main>
    </AppScreen>
  );
};

export default TopicRecommendPage;
