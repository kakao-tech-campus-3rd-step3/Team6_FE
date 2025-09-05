import profileImage from "@/assets/profileimg.png";
import { Calendar, UserRound } from "lucide-react";

import type { Profile } from "./types";

interface ProfileCardProps {
  profile: Profile;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <div className="mb-6 h-[470px] w-full max-w-sm rounded-2xl bg-white px-6 py-5 shadow-md">
      {/* 프로필 이미지 */}
      <div className="mb-4 flex justify-center">
        <img src={profileImage} alt="프로필 이미지" className="h-25 w-25 rounded-full object-cover shadow-md" />
      </div>

      {/* 기본 정보 */}
      <div className="mb-4 text-center text-2xl font-bold">{profile.name}</div>

      <div className="mb-4 flex justify-center space-x-4 text-black">
        <div className="flex items-center space-x-1">
          <span className="text-sm">
            <Calendar className="h-4 w-4" />
          </span>
          <span className="text-sm">{profile.age}세</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm">
            <UserRound className="h-4 w-4" />
          </span>
          <span className="text-primary text-sm">{profile.mbti}</span>
        </div>
      </div>

      {/* 관심사 */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {profile.interests.map((interest) => (
          <span key={interest} className="bg-primary rounded-full px-3 py-1 text-sm text-white">
            #{interest}
          </span>
        ))}
      </div>

      {/* 한줄소개 */}
      <div className="">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">한줄 소개</h3>
        <p className="text-sm leading-relaxed text-gray-600">{profile.intro}</p>
      </div>
    </div>
  );
};
