import { WaitingMessage, WaitingRoomCode, WaitingRoomParticipants, WaitingRoomQRCode } from "@/components/waitingroom";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";

const WaitingRoomPage: ActivityComponentType<"WaitingRoomPage"> = () => {
  return (
    <AppScreen appBar={{ title: "대기실" }}>
      <main className="bg-gradient-primary flex flex-col items-center space-y-4 p-4 pb-8">
        <WaitingRoomCode />
        <WaitingMessage />
        <WaitingRoomQRCode />
        <WaitingRoomParticipants />
      </main>
    </AppScreen>
  );
};

export default WaitingRoomPage;
