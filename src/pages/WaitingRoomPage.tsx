import { Button } from "@/components/common";
import { WaitingMessage, WaitingRoomCode, WaitingRoomParticipants, WaitingRoomQRCode } from "@/components/waitingroom";
import { useStageNavigation } from "@/hooks";
import { useStompPublish } from "@/hooks/stomp";
import { setLastEventType } from "@/hooks/useStageNavigation";
import { useWaitingRoomData } from "@/hooks/waitingroom";
import { PageLayout } from "@/layouts/PageLayout";
import { useParams, useSearchParams } from "react-router-dom";

const WaitingRoomPage = () => {
  const params = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();

  const roomId = params.roomId?.trim() || "";
  const isHost = searchParams.get("isHost") === "true";

  useStageNavigation();

  const { participants, maxParticipants, isConnected } = useWaitingRoomData({
    roomId,
    isHost,
  });

  const { publish } = useStompPublish();

  if (!roomId) {
    return (
      <PageLayout appBar={{ title: "대기실" }}>
        <main className="flex items-center justify-center p-4 text-sm text-red-600">잘못된 방 ID입니다.</main>
      </PageLayout>
    );
  }

  const handleStartGame = () => {
    if (!roomId) return;

    setLastEventType(roomId, "SELECT");
    publish(`/app/room/${roomId}/change-stage`, {
      eventType: "SELECT",
      stage: "PROFILE_VIEW_STAGE",
    });
  };

  return (
    <PageLayout appBar={{ title: "대기실" }}>
      <main className="bg-gradient-primary flex min-h-screen flex-col items-center space-y-4 p-4 pb-8">
        <WaitingRoomCode roomId={roomId} />
        <WaitingMessage />
        <WaitingRoomQRCode roomId={roomId} />
        <WaitingRoomParticipants participants={participants} maxParticipants={maxParticipants} />

        {isHost && (
          <Button onClick={handleStartGame} className="w-full max-w-sm font-semibold">
            시작하기
          </Button>
        )}

        {!isConnected && (
          <div className="flex items-center justify-center space-x-2 text-center text-sm text-white/80">
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
            <span>서버에 연결하고 방 정보를 가져오는 중...</span>
          </div>
        )}
      </main>
    </PageLayout>
  );
};

export default WaitingRoomPage;
