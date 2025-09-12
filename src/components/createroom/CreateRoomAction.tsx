import { Button } from "@/components/common";
import { type CreateRoomFormData, useCreateRoomAction } from "@/hooks/createroom";

interface CreateRoomActionProps {
  formData: CreateRoomFormData;
  isFormValid: boolean;
}

export const CreateRoomAction = ({ formData, isFormValid }: CreateRoomActionProps) => {
  const { isCreating, isReady, handleCreateRoom } = useCreateRoomAction(formData, isFormValid);

  return (
    <section className="space-y-4 pt-8">
      <Button className="text-lg" onClick={handleCreateRoom} disabled={!isReady || isCreating || !isFormValid}>
        {isCreating ? "방 생성 중..." : "QR 코드 생성하기"}
      </Button>

      {!isReady && <p className="text-center text-sm text-white/80">연결 준비 중...</p>}
    </section>
  );
};
