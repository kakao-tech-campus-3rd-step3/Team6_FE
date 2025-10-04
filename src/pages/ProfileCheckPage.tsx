import { ProfileCheckComplete, ProfileCheckReadyButton, ProfileCheckStatus } from "@/components/profilecheck";
import { useRoomParticipants } from "@/hooks/profileview";
import { useStageNavigation } from "@/hooks";
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

  const { participants: fetchedParticipants, isLoading } = useRoomParticipants(participantsFromParams ? "" : roomId);

  const participants = participantsFromParams || fetchedParticipants;

  const handleStart = () => {
    if (!roomId || !isHost) return;

    setLastEventType(roomId, "NEXT");
    publish(`/app/room/${roomId}/change-stage`, {
      eventType: "NEXT",
    });
  };

  if ((!participantsFromParams && isLoading) || participants.length === 0) {
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
