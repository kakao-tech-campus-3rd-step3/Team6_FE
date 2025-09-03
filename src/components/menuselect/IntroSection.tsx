import { MessageCircleMore } from "lucide-react";

export const IntroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-md">
        <MessageCircleMore size={28} className="text-white" />
      </div>

      <p className="mb-2 text-xl font-bold text-gray-900">어색함을 풀어보세요!</p>
      <p className="text-sm text-gray-500">원하는 활동을 선택해주세요</p>
    </div>
  );
};
