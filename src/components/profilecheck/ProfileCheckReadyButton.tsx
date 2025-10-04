import { Button } from "@/components/common";
import type { ProfileCheckReadyButtonProps } from "@/components/profilecheck/types";

const ProfileCheckReadyButton = ({ onReadyClick, isHost }: ProfileCheckReadyButtonProps) => {
  if (!isHost) {
    return null;
  }

  return (
    <Button onClick={onReadyClick} className="mt-4 w-full text-[18px] font-semibold">
      시작하기
    </Button>
  );
};

export default ProfileCheckReadyButton;
