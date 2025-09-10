import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { Check } from "lucide-react";

const ProfileCheckPage: ActivityComponentType<"ProfileCheckPage"> = () => {
  return (
    <AppScreen appBar={{ title: "프로필 소개" }}>
      <main className="bg-gradient-primary p-4">
        <div className="flex flex-col items-center">
          {/* 완료 아이콘과 메시지 */}
          <div className="mt-0 flex flex-col items-center space-y-4">
            <div className="bg-primary flex h-20 w-20 items-center justify-center rounded-full">
              <Check className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-black">모든 프로필 확인 완료!</div>
              <p className="text-sm text-gray-600">이제 함께 아이스브레이킹을 시작해보세요</p>
            </div>
          </div>

          {/* 준비 상태 카드 */}
          <div className="mt-6 h-[350px] w-full rounded-[16px] bg-white p-4 shadow-md">
            <h3 className="text-md mb-4 flex justify-center font-bold text-black">준비 상태</h3>
            <div className="space-y-3">
              <div className="text-md flex h-14 items-center justify-between rounded-[8px] bg-[#F9FAFB] px-6 text-gray-800">
                김민수
                <span className="text-md rounded-full bg-[#DCFCE7] px-4 py-1 text-[#15803D]">준비 완료</span>
              </div>
              <div className="text-md flex h-14 items-center justify-between rounded-[8px] bg-[#F9FAFB] px-6 text-gray-800">
                이지은
                <span className="text-md rounded-full bg-[#DCFCE7] px-4 py-1 text-[#15803D]">준비 완료</span>
              </div>
              <div className="text-md flex h-14 items-center justify-between rounded-[8px] bg-[#F9FAFB] px-6 text-gray-800">
                박준혁
                <span className="text-md rounded-full bg-[#FEF9C3] px-4 py-1 text-[#A16207]">대기 중 </span>
              </div>
              <div className="text-md flex h-14 items-center justify-between rounded-[8px] bg-[#F9FAFB] px-6 text-gray-800">
                최민지
                <span className="text-md rounded-full bg-[#FEF9C3] px-4 py-1 text-[#A16207]">대기 중 </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppScreen>
  );
};

export default ProfileCheckPage;
