import profileImage from "@/assets/profileimg.png";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { Calendar, UserRound } from "lucide-react";
import { useState } from "react";

interface Profile {
  profileId: number;
  name: string;
  age: number;
  mbti: string;
  interests: string[];
  intro: string;
}

const profiles: Profile[] = [
  {
    profileId: 1,
    name: "김민수",
    age: 25,
    mbti: "ENFP",
    interests: ["영화", "음악", "여행", "운동"],
    intro: "새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 😊",
  },
  {
    profileId: 2,
    name: "최원아",
    age: 22,
    mbti: "INTP",
    interests: ["음악", "영화", "독서", "요리", "게임", "반려동물"],
    intro: "새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 😊",
  },
  {
    profileId: 3,
    name: "차서현",
    age: 22,
    mbti: "ISFJ",
    interests: ["음악", "영화", "사진", "쇼핑"],
    intro: "새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 😊",
  },
];

const ProfileViewPage: ActivityComponentType<"ProfileViewPage"> = () => {
  const [currentProfile, setCurrentProfile] = useState<Profile>(profiles[0]);

  return (
    <AppScreen appBar={{ title: "프로필 소개" }}>
      <main className="bg-gradient-primary p-6">
        <div className="flex flex-col items-center">
          {/* 프로필 카드 */}
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md">
            {/* 프로필 이미지 */}
            <div className="mb-4 flex justify-center">
              <img src={profileImage} alt="프로필 이미지" className="h-30 w-30 rounded-full object-cover shadow-md" />
            </div>

            {/* 기본 정보 */}
            <div className="mb-4 text-center text-2xl font-bold">{currentProfile.name}</div>

            <div className="mb-10 flex justify-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="text-sm">
                  <Calendar className="h-4 w-4" />
                </span>
                <span className="text-sm">{currentProfile.age}세</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="text-primary text-sm">{currentProfile.mbti}</span>
              </div>
            </div>

            {/* 관심사 */}
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {currentProfile.interests.map((interest) => (
                <span key={interest} className="bg-primary rounded-full px-3 py-1 text-sm text-white">
                  #{interest}
                </span>
              ))}
            </div>

            {/* 한줄소개 */}
            <div className="">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">한줄 소개</h3>
              <p className="text-sm leading-relaxed text-gray-600">{currentProfile.intro}</p>
            </div>
          </div>
        </div>
      </main>
    </AppScreen>
  );
};

export default ProfileViewPage;
