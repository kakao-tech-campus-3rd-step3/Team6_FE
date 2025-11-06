import { Button } from "@/components/common";
import { EndingComment, SaveComment } from "@/components/ending";
import { PageLayout } from "@/layouts/PageLayout";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EndingPage = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearUser = useUserStore((state) => state.clearParticipants);
  const navigate = useNavigate();

  useEffect(() => {
    clearAuth();
    clearUser();
  }, [clearAuth, clearUser]);

  return (
    <PageLayout
      appBar={{
        title: "마무리",
      }}
    >
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <EndingComment />
        <SaveComment />
        <div className="flex flex-row justify-around gap-2">
          <Button className="h-12 text-lg font-semibold">프로필 저장하기</Button>
          <Button className="h-12 text-lg font-semibold" variant="sub" onClick={() => navigate("/")}>
            홈으로
          </Button>
        </div>
      </main>
    </PageLayout>
  );
};

export default EndingPage;
