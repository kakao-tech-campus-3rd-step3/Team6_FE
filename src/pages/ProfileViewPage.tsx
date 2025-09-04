import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";

const ProfileViewPage: ActivityComponentType<"ProfileViewPage"> = () => {
  return (
    <AppScreen appBar={{ title: "프로필 소개" }}>
      <main className="bg-gradient-primary p-4">
        <div className="text-2xl">프로필 보기</div>
      </main>
    </AppScreen>
  );
};

export default ProfileViewPage;
