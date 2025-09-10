import { ProfileCheckComplete, ProfileCheckReadyButton, ProfileCheckStatus } from "@/components/profilecheck";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
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
          <ProfileCheckComplete />
          <ProfileCheckStatus members={members} />
          <ProfileCheckReadyButton onReadyClick={handleReadyClick} />
        </div>
      </main>
    </AppScreen>
  );
};

export default ProfileCheckPage;
