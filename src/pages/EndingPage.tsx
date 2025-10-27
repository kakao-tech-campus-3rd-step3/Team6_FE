import { Button } from "@/components/common";
import { EndingComment, SaveComment } from "@/components/ending";
import { PageLayout } from "@/layouts/PageLayout";

const EndingPage = () => {
  return (
    <PageLayout appBar={{ title: "마무리" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <EndingComment />
        <SaveComment />
        <Button className="h-12 text-lg font-semibold">프로필 저장하기</Button>
      </main>
    </PageLayout>
  );
};

export default EndingPage;
