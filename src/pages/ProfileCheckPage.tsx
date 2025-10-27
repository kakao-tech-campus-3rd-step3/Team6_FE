import { ProfileCheckComplete, ProfileCheckReadyButton, ProfileCheckStatus } from "@/components/profilecheck";
import { useStageNavigation } from "@/hooks";
import type { Participant } from "@/hooks/profileview/types";
import { useRoomParticipants } from "@/hooks/profileview";
import { useStompPublish } from "@/hooks/stomp";
import { setLastEventType } from "@/hooks/useStageNavigation";
import { PageLayout } from "@/layouts/PageLayout";
import { useLocation, useSearchParams } from "react-router-dom";

const ProfileCheckPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const roomId = searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";

  useStageNavigation();
  const { publish } = useStompPublish();

  const participantsFromState = (location.state as { participants?: Participant[] })?.participants;
  const { participants: fetchedParticipants, isLoading } = useRoomParticipants(roomId);

  const participants = participantsFromState || fetchedParticipants;

  const handleStart = () => {
    if (!roomId || !isHost) return;

    const success = publish(`/app/room/${roomId}/change-stage`, {
      eventType: "NEXT",
    });
    if (!success) {
      // TODO: 실패 시 UI 피드백
      console.error("퍼블리시 실패");
      return;
    }
    setLastEventType(roomId, "NEXT");
  };

  if (isLoading && participants.length === 0) {
    return (
      <PageLayout appBar={{ title: "프로필 소개" }}>
        <main className="bg-gradient-primary flex min-h-screen items-center justify-center p-4">
          <div className="text-center text-white">
            <div className="mb-2 text-lg">참여자 정보를 불러오는 중...</div>
            <div className="text-sm text-white/70">잠시만 기다려주세요</div>
          </div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout appBar={{ title: "프로필 소개" }}>
      <main className="bg-gradient-primary min-h-screen p-4">
        <div className="flex flex-col items-center">
          <ProfileCheckComplete />
          <ProfileCheckStatus members={participants} />
          <ProfileCheckReadyButton onReadyClick={handleStart} isHost={isHost} />
        </div>
      </main>
    </PageLayout>
  );
};

export default ProfileCheckPage;
