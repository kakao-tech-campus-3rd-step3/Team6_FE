import { Button } from "@/components/common";
import {
  PageDots,
  ProfileNavigationHint,
  ProfileNavigationSection,
  ProfileViewLoading,
} from "@/components/profileview";
import { useProfileNavigation, useRoomParticipants, useSwipe } from "@/hooks/profileview";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useActivity, useFlow } from "@stackflow/react/future";
import { useEffect } from "react";

const ProfileViewPage: ActivityComponentType<"ProfileViewPage"> = () => {
  const { params } = useActivity();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const isHost = params?.isHost === "true";

  const { participants, isLoading } = useRoomParticipants(roomId);
  const { push } = useFlow();

  const { currentIndex, handleNext, handlePrev, canGoNext, canGoPrev, isLast } = useProfileNavigation({
    totalCount: participants.length,
    onComplete: () => {
      push("ProfileCheckPage", {
        title: "프로필 확인",
        roomId,
        participants: JSON.stringify(participants),
        isHost: String(isHost),
      });
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
      <AppScreen appBar={{ title: "프로필 소개" }}>
        <main className="bg-gradient-primary flex min-h-screen items-center justify-center p-6">
          <ProfileViewLoading />
        </main>
      </AppScreen>
    );
  }

  return (
    <AppScreen appBar={{ title: "프로필 소개" }}>
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
            onClick={() =>
              push("ProfileCheckPage", {
                title: "프로필 확인",
                roomId,
                participants: JSON.stringify(participants),
                isHost: String(isHost),
              })
            }
            className="w-full max-w-md"
            aria-label="모든 프로필 확인 완료, 다음 단계로 이동"
          >
            완료
          </Button>
        )}
      </main>
    </AppScreen>
  );
};

export default ProfileViewPage;
