import { IntroSection} from "@/components/topicrecommend";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";

const TopicRecommendPage: ActivityComponentType = () => {

  return (
    <AppScreen appBar={{ title: "주제 추천" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <IntroSection />
      </main>
    </AppScreen>
  );
};

export default TopicRecommendPage;
