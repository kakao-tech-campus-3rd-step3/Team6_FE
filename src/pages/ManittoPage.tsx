import { ProfileCard } from "@/components/profileview";
import type { Profile } from "@/components/profileview/types";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";

const ManittoPage: ActivityComponentType<"ManittoPage"> = () => {
  const manittoProfile: Profile = {
    profileId: 1,
    name: "김민수",
    age: 25,
    mbti: "ENFP",
    interests: ["영화", "음악", "여행", "운동"],
    intro: "새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 😊",
  };

  return (
    <AppScreen appBar={{ title: "마니또" }}>
      <main className="bg-gradient-primary min-h-screen p-4">
        <div className="flex flex-col items-center">
          {/* 상단 안내 텍스트 */}
          <div className="mb-6 text-center">
            <p className="text-xl font-semibold text-black">나의 마니또를 확인하세요</p>
          </div>

          {/* 마니또 프로필 카드 */}
          <ProfileCard profile={manittoProfile} />
        </div>
      </main>
    </AppScreen>
  );
};

export default ManittoPage;
