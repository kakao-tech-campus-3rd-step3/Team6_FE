import { Loader } from "lucide-react";

export const MenuWaiting = () => {
  return (
    <div className="flex min-h-screen flex-col items-center text-center space-y-4">
      <Loader
        className="mt-16 h-10 w-10 text-primary animate-[spin_3s_linear_infinite]"
        aria-hidden="true"
      />
      <span className="sr-only">로딩 중</span>

      <p className="mt-5 text-xl font-semibold text-gray-900">
        방장이 메뉴 선택 중
      </p>
      <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
    </div>
  );
};
