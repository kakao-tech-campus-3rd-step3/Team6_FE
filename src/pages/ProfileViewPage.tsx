import profileImage from "@/assets/profileimg.png";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { Calendar, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

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
    interests: ["스포츠", "음악", "영화", "독서", "여행", "요리", "게임", "반려동물"],
    intro:
      "새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운",
  },
  {
    profileId: 3,
    name: "차서현",
    age: 22,
    mbti: "ISFJ",
    interests: ["음악", "영화", "사진", "쇼핑"],
    intro:
      "새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운",
  },
];

const ProfileViewPage: ActivityComponentType<"ProfileViewPage"> = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentProfile = profiles[currentProfileIndex];
  const progressPercentage = ((10 - timeLeft) / 10) * 100;

  return (
    <AppScreen appBar={{ title: "프로필 소개" }}>
      <main className="bg-gradient-primary px-6 py-4">
        <div className="flex flex-col items-center">
          {/* 상단 진행 점 */}
          <div className="mb-4 flex space-x-2">
            {profiles.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === currentProfileIndex ? "bg-primary" : "bg-opacity-30 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* 프로필 카드 */}
          <div className="h-[470px] w-full max-w-sm rounded-2xl bg-white p-6 shadow-md">
            {/* 프로필 이미지 */}
            <div className="mb-4 flex justify-center">
              <img src={profileImage} alt="프로필 이미지" className="h-25 w-25 rounded-full object-cover shadow-md" />
            </div>

            {/* 기본 정보 */}
            <div className="mb-4 text-center text-2xl font-bold">{currentProfile.name}</div>

            <div className="mb-4 flex justify-center space-x-4 text-black">
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
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {currentProfile.interests.map((interest) => (
                <span key={interest} className="bg-primary rounded-full px-3 py-1 text-sm text-white">
                  #{interest}
                </span>
              ))}
            </div>

            {/* 한줄소개 */}
            <div className="">
              <h3 className="mb-2 text-sm font-semibold text-black">한줄 소개</h3>
              <p className="text-sm leading-relaxed text-black">{currentProfile.intro}</p>
            </div>
          </div>

          {/* 하단바 */}
          <div className="mt-6 w-full max-w-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {currentProfileIndex + 1} / {profiles.length}
              </span>
              <span className="text-sm text-gray-500">{timeLeft}초 남음</span>
            </div>

            {/* 진행바 */}
            <div className="bg-opacity-30 mb-2 h-2 w-full rounded-full bg-gray-300">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* 다음사람 */}
          <div className="text-center">
            <span className="text-sm text-gray-500">
              다음: {profiles[(currentProfileIndex + 1) % profiles.length].name}
            </span>
          </div>
        </div>
      </main>
    </AppScreen>
  );
};

export default ProfileViewPage;
