import { Button } from "@/components/common";
import { EndingComment, SaveComment } from "@/components/ending";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";

const EndingPage: ActivityComponentType = () => {

  return (
    <AppScreen appBar={{ title: "마무리" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <EndingComment />
        <SaveComment />
        <Button className="h-12 font-semibold text-lg">프로필 저장하기</Button>
      </main>
    </AppScreen>
  );
};

export default EndingPage;
