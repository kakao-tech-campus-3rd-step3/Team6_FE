import { Button } from "@/components/common";
import { useFlow } from "@stackflow/react/future";

export const CreateRoomAction = () => {
  const { push } = useFlow();

  const handleNavigateWaitingRoom = () => {
    push("WaitingRoomPage", { title: "대기실" });
  };

  return (
    <section className="space-y-4 pt-8">
      <Button className="text-lg" onClick={handleNavigateWaitingRoom}>
        QR 코드 생성하기
      </Button>
    </section>
  );
};
