import { Button } from "@/components/common";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { WaitingMessage, WaitingRoomCode, WaitingRoomParticipants, WaitingRoomQRCode } from "@/components/waitingroom";
import { useWaitingRoomData } from "@/hooks/waitingroom";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useActivity, useFlow } from "@stackflow/react/future";

const WaitingRoomContent = () => {
  const { push } = useFlow();
  const { params } = useActivity();

  const roomIdParams = params?.roomId;
  const roomId = typeof roomIdParams === "string" && roomIdParams.trim() ? roomIdParams.trim() : "";
  const isHost = params?.isHost === "true";

  const { participants, maxParticipants, isConnected } = useWaitingRoomData({
    roomId,
    isHost,
  });

  if (!roomId) {
    return (
      <AppScreen appBar={{ title: "대기실" }}>
        <main className="flex items-center justify-center p-4 text-sm text-red-600">잘못된 방 ID입니다.</main>
      </AppScreen>
    );
  }

  const handleStartGame = () => {
    push("ProfileViewPage", { title: "프로필 소개" });
  };

  return (
    <AppScreen appBar={{ title: "대기실" }}>
      <main className="bg-gradient-primary flex flex-col items-center space-y-4 p-4 pb-8">
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
    </AppScreen>
  );
};

const WaitingRoomPage: ActivityComponentType<"WaitingRoomPage"> = () => {
  return (
    <AuthGuard>
      <WaitingRoomContent />
    </AuthGuard>
  );
};

export default WaitingRoomPage;
