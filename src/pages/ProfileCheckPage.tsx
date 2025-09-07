import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";

const ProfileCheckPage: ActivityComponentType<"ProfileCheckPage"> = () => {
  return (
    <AppScreen appBar={{ title: "프로필 소개" }}>
      <main className="bg-gradient-primary p-4">
        <div className="flex flex-col items-center">프로필 확인 완료</div>
      </main>
    </AppScreen>
  );
};

export default ProfileCheckPage;
