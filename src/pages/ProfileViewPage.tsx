import { NextProfile, PageDots, ProfileCard, ProgressBar } from "@/components/profileview";
import type { Profile } from "@/components/profileview/types";
import { profiles } from "@/data/profiles";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { useEffect, useState } from "react";

const ProfileViewPage: ActivityComponentType<"ProfileViewPage"> = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { push } = useFlow();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const nextIndex = (currentProfileIndex + 1) % profiles.length;

          if (nextIndex === 0) {
            push("ProfileCheckPage", { title: "프로필 확인" });
            return 10;
          }

          setCurrentProfileIndex(nextIndex);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentProfileIndex, push]);

  const currentProfile = profiles[currentProfileIndex];
  const progressPercentage = ((10 - timeLeft) / 10) * 100;
  const nextProfileName = currentProfileIndex < profiles.length - 1 ? profiles[currentProfileIndex + 1].name : "";

  return (
    <AppScreen appBar={{ title: "프로필 소개" }}>
      <main className="bg-gradient-primary min-h-screen p-6">
        <div className="flex flex-col items-center">
          <PageDots totalCount={profiles.length} currentIndex={currentProfileIndex} />
          <ProfileCard profile={currentProfile} />
          <ProgressBar
            currentIndex={currentProfileIndex}
            totalCount={profiles.length}
            timeLeft={timeLeft}
            progressPercentage={progressPercentage}
          />
          <NextProfile
            currentIndex={currentProfileIndex}
            totalCount={profiles.length}
            nextProfileName={nextProfileName}
          />
        </div>
      </main>
    </AppScreen>
  );
};

export default ProfileViewPage;
