import profileImage from "@/assets/profileimg.png";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { Calendar } from "lucide-react";
import { UserRound } from "lucide-react";

const ProfileViewPage: ActivityComponentType<"ProfileViewPage"> = () => {
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
            <div className="mb-4 text-center text-2xl font-bold">김민수</div>

            <div className="mb-12 flex justify-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="text-sm">
                  <Calendar className="h-4 w-4" />
                </span>
                <span className="text-sm">25세</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="text-primary text-sm">ENFP</span>
              </div>
            </div>

            {/* 관심사 */}
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <span className="bg-primary rounded-full px-3 py-1 text-sm text-white">#영화</span>
              <span className="bg-primary rounded-full px-3 py-1 text-sm text-white">#음악</span>
              <span className="bg-primary rounded-full px-3 py-1 text-sm text-white">#여행</span>
              <span className="bg-primary rounded-full px-3 py-1 text-sm text-white">#운동</span>
            </div>

            {/* 한줄소개 */}
            <div className="">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">한줄 소개</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 😊
              </p>
            </div>
          </div>
        </div>
      </main>
    </AppScreen>
  );
};

export default ProfileViewPage;
