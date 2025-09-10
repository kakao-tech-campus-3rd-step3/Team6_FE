import { Button } from "@/components/common";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const ProfileCheckPage: ActivityComponentType<"ProfileCheckPage"> = () => {
  const { push } = useFlow();
  const [members, setMembers] = useState([
    { name: "김민수", isReady: false },
    { name: "이지은", isReady: true },
    { name: "박준혁", isReady: true },
    { name: "최민지", isReady: true },
  ]);

  const handleReadyClick = () => {
    setMembers((prev) => prev.map((member, index) => (index === 0 ? { ...member, isReady: true } : member)));
  };

  useEffect(() => {
    const allReady = members.every((member) => member.isReady);
    if (allReady) {
      const timer = setTimeout(() => {
        push("MenuSelectPage", {});
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [members]);

  return (
    <AppScreen appBar={{ title: "프로필 소개" }}>
      <main className="bg-gradient-primary min-h-screen p-4">
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
          <div className="mt-6 h-[340px] w-full rounded-[16px] bg-white p-4 shadow-md">
            <h3 className="text-md mb-4 flex justify-center font-bold text-black">준비 상태</h3>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.name}
                  className="text-md flex h-14 items-center justify-between rounded-[8px] bg-[#F9FAFB] px-6 text-gray-800"
                >
                  {member.name}
                  <span
                    className={`text-md rounded-full px-4 py-1 ${
                      member.isReady ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF9C3] text-[#A16207]"
                    }`}
                  >
                    {member.isReady ? "준비 완료" : "대기 중"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 준비 완료 버튼 */}
          <Button onClick={handleReadyClick} className="mt-4 w-full text-[18px] font-semibold">
            준비 완료
          </Button>
        </div>
      </main>
    </AppScreen>
  );
};

export default ProfileCheckPage;
