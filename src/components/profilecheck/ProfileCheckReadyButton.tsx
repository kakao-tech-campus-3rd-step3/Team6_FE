import { Button } from "@/components/common";

interface ProfileCheckReadyButtonProps {
  onReadyClick: () => void;
}

const ProfileCheckReadyButton = ({ onReadyClick }: ProfileCheckReadyButtonProps) => {
  return (
    <Button onClick={onReadyClick} className="mt-4 w-full text-[18px] font-semibold">
      준비 완료
    </Button>
  );
};

export default ProfileCheckReadyButton;
