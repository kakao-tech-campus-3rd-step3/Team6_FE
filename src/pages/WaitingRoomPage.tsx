import { Button } from "@/components/common";
import { WaitingMessage, WaitingRoomCode, WaitingRoomParticipants, WaitingRoomQRCode } from "@/components/waitingroom";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";

const WaitingRoomPage: ActivityComponentType<"WaitingRoomPage"> = () => {
  const { push } = useFlow();

  const handleStartGame = () => {
    push("ProfileViewPage", { title: "프로필 소개" });
  };

  return (
    <AppScreen appBar={{ title: "대기실" }}>
      <main className="bg-gradient-primary flex flex-col items-center space-y-4 p-4 pb-8">
        <WaitingRoomCode />
        <WaitingMessage />
        <WaitingRoomQRCode />
        <WaitingRoomParticipants />

        <Button onClick={handleStartGame} className="h-12 w-full max-w-sm font-semibold">
          시작하기
        </Button>
      </main>
    </AppScreen>
  );
};

export default WaitingRoomPage;
