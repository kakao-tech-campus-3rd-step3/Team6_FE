import { Button } from "@/components/common";
import { useCreateRoomAction } from "@/hooks/createroom";
import type { CreateRoomFormSchemaType } from "@/model/CreateRoomFormSchema";
import { useFormContext } from "react-hook-form";

interface CreateRoomActionProps {
  isFormValid: boolean;
}

export const CreateRoomAction = ({ isFormValid }: CreateRoomActionProps) => {
  const { watch } = useFormContext<CreateRoomFormSchemaType>();
  const formData = {
    roomName: watch("roomName"),
    capacity: watch("capacity"),
    purpose: watch("purpose") || "",
  };

  const { isCreating, isReady, handleCreateRoom } = useCreateRoomAction(formData, isFormValid);
  const isDisabled = !isReady || isCreating || !isFormValid;

  return (
    <section className="space-y-4 pt-8">
      <Button
        className="text-lg"
        variant={isDisabled ? "sub" : "main"}
        onClick={handleCreateRoom}
        disabled={isDisabled}
      >
        {isCreating ? "방 생성 중..." : "QR 코드 생성하기"}
      </Button>

      {!isReady && <p className="text-center text-sm text-white/80">연결 준비 중...</p>}
    </section>
  );
};
