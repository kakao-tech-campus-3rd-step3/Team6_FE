import { Button } from "@/components/common";
import { EndingComment, SaveComment } from "@/components/ending";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import { PageLayout } from "@/layouts/PageLayout";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/useUserStore";

const EndingPage = () => {
  useStageNavigation();
  const { handleBack, canGoBack } = useHandleBackPage();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearUser = useUserStore((state) => state.clearParticipants);

  clearAuth();
  clearUser();

  return (
    <PageLayout
      appBar={{
        title: "마무리",
        backButton: canGoBack
          ? {
              onClick: handleBack,
            }
          : { render: () => null },
      }}
    >
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <EndingComment />
        <SaveComment />
        <Button className="h-12 text-lg font-semibold">프로필 저장하기</Button>
      </main>
    </PageLayout>
  );
};

export default EndingPage;
