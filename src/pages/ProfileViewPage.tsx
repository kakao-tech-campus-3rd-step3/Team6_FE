import { NextProfile, PageDots, ProfileCard, ProgressBar } from "@/components/profileview";
import { profiles } from "@/data/profiles";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { useEffect, useState } from "react";

const TIMER_INTERVAL = 1000;
const PERCENTAGE_MULTIPLIER = 100;

const PROFILE_VIEW_TIME = 10;

const ProfileViewPage: ActivityComponentType<"ProfileViewPage"> = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PROFILE_VIEW_TIME);
  const { push } = useFlow();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      const nextIndex = (currentProfileIndex + 1) % profiles.length;

      if (nextIndex === 0) {
        push("ProfileCheckPage", { title: "프로필 확인" });
        return;
      } else {
        setCurrentProfileIndex(nextIndex);
        setTimeLeft(PROFILE_VIEW_TIME);
      }
    }
  }, [timeLeft, currentProfileIndex]);

  const currentProfile = profiles[currentProfileIndex];
  const progressPercentage = ((PROFILE_VIEW_TIME - timeLeft) / PROFILE_VIEW_TIME) * PERCENTAGE_MULTIPLIER;
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
