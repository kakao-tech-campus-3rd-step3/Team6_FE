import profileImage from "@/assets/profileimg.png";
import type { ProfileCardProps } from "@/components/profileview";
import { Calendar, UserRound } from "lucide-react";

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <article
      className="mb-6 h-[470px] w-[300px] max-w-sm rounded-2xl bg-white px-6 py-5 shadow-md"
      aria-label={`${profile.name}님의 프로필`}
    >
      <header className="mb-4 flex justify-center">
        <img
          src={profileImage}
          alt={`${profile.name}님의 프로필 사진`}
          className="h-25 w-25 rounded-full object-cover shadow-md"
        />
      </header>

      <h2 className="mb-4 text-center text-2xl font-bold">{profile.name}</h2>

      <section className="mb-4 flex justify-center space-x-4 text-black" aria-label="기본 정보">
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">
            <span className="sr-only">나이: </span>
            {profile.age}세
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <UserRound className="h-4 w-4" aria-hidden="true" />
          <span className="text-primary text-sm">
            <span className="sr-only">MBTI: </span>
            {profile.mbtiType}
          </span>
        </div>
      </section>

      <section className="mb-6" aria-label="관심사">
        <ul className="flex flex-wrap justify-center gap-2">
          {profile.interests.map((interest) => (
            <li key={interest} className="bg-primary rounded-full px-3 py-1 text-sm text-white">
              #{interest}
            </li>
          ))}
        </ul>
      </section>

      {profile.introduction && (
        <section aria-label="한줄 소개">
          <h3 className="mb-2 text-sm font-semibold text-gray-700">한줄 소개</h3>
          <p className="text-sm leading-relaxed text-gray-600">{profile.introduction}</p>
        </section>
      )}
    </article>
  );
};
