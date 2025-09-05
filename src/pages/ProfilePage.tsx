import { Button } from "@/components/common";
import { ProfileInfo, ProfileInterests, ProfileIntroduce, ProfileMbti } from "@/components/createprofile";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";

const ProfilePage: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "프로필 설정" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        {/* TODO: 프로필 사진 추가 */}
        <ProfileInfo />
        <ProfileInterests />
        <ProfileMbti />
        <ProfileIntroduce />

        <Button className="mt-8 h-12 font-semibold">다음 단계</Button>
      </main>
    </AppScreen>
  );
};

export default ProfilePage;
