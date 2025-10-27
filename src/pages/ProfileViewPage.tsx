import { Button } from "@/components/common";
import {
  PageDots,
  ProfileNavigationHint,
  ProfileNavigationSection,
  ProfileViewLoading,
} from "@/components/profileview";
import { useProfileNavigation, useRoomParticipants, useSwipe } from "@/hooks/profileview";
import { PageLayout } from "@/layouts/PageLayout";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ProfileViewPage = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";

  const { participants, isLoading } = useRoomParticipants(roomId);
  const navigate = useNavigate();

  const { currentIndex, handleNext, handlePrev, canGoNext, canGoPrev, isLast } = useProfileNavigation({
    totalCount: participants.length,
    onComplete: () => {
      navigate(`/profile-check?roomId=${roomId}&isHost=${isHost}`, { state: { participants } });
    },
  });

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrev,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && canGoPrev) {
        handlePrev();
      } else if (e.key === "ArrowRight" && canGoNext) {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, canGoNext, canGoPrev]);

  const currentProfile = participants[currentIndex];

  if (isLoading || participants.length === 0) {
    return (
      <PageLayout appBar={{ title: "프로필 소개" }}>
        <main className="bg-gradient-primary flex min-h-screen items-center justify-center p-6">
          <ProfileViewLoading />
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout appBar={{ title: "프로필 소개" }}>
      <main
        className="bg-gradient-primary flex min-h-screen flex-col items-center justify-between p-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <PageDots totalCount={participants.length} currentIndex={currentIndex} />
        <ProfileNavigationHint />
        <ProfileNavigationSection
          currentProfile={currentProfile}
          currentIndex={currentIndex}
          totalCount={participants.length}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        {isLast && (
          <Button
            onClick={() => navigate(`/profile-check?roomId=${roomId}&isHost=${isHost}`, { state: { participants } })}
            className="w-full max-w-md"
            aria-label="모든 프로필 확인 완료, 다음 단계로 이동"
          >
            완료
          </Button>
        )}
      </main>
    </PageLayout>
  );
};

export default ProfileViewPage;
