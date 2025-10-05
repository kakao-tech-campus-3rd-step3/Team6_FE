import { ProfileCheckComplete, ProfileCheckReadyButton, ProfileCheckStatus } from "@/components/profilecheck";
import { useStageNavigation } from "@/hooks";
import { useRoomParticipants } from "@/hooks/profileview";
import { useStompPublish } from "@/hooks/stomp";
import { setLastEventType } from "@/hooks/useStageNavigation";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useActivity } from "@stackflow/react/future";
import { useMemo } from "react";

const ProfileCheckPage: ActivityComponentType<"ProfileCheckPage"> = () => {
  const { params } = useActivity();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const isHost = params?.isHost === "true";

  useStageNavigation();
  const { publish } = useStompPublish();

  const participantsFromParams = useMemo(() => {
    try {
      return params?.participants && typeof params.participants === "string" ? JSON.parse(params.participants) : null;
    } catch {
      return null;
    }
  }, [params?.participants]);

  const { participants: fetchedParticipants, isLoading } = useRoomParticipants(roomId);

  const participants = fetchedParticipants.length > 0 ? fetchedParticipants : participantsFromParams || [];

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
      <AppScreen appBar={{ title: "프로필 소개" }}>
        <main className="bg-gradient-primary flex min-h-screen items-center justify-center p-4">
          <div className="text-center text-white">
            <div className="mb-2 text-lg">참여자 정보를 불러오는 중...</div>
            <div className="text-sm text-white/70">잠시만 기다려주세요</div>
          </div>
        </main>
      </AppScreen>
    );
  }

  return (
    <AppScreen appBar={{ title: "프로필 소개" }}>
      <main className="bg-gradient-primary min-h-screen p-4">
        <div className="flex flex-col items-center">
          <ProfileCheckComplete />
          <ProfileCheckStatus members={participants} />
          <ProfileCheckReadyButton onReadyClick={handleStart} isHost={isHost} />
        </div>
      </main>
    </AppScreen>
  );
};

export default ProfileCheckPage;
