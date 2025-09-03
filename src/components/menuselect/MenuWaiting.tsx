import { Loader } from "lucide-react";

export const MenuWaiting = () => {
  return (
    <div className="flex min-h-[100vh] flex-col items-center text-center space-y-4 bg-gradient-primary">
      <Loader
        className="mt-15 h-10 w-10 text-primary"
        style={{ animation: "spin 3s linear infinite" }}
      />

      <p className="mt-5 text-xl font-semibold text-gray-900">
        방장이 메뉴 선택 중
      </p>
      <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
    </div>
  );
};
