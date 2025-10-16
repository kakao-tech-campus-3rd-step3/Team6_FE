import { Button } from "@/components/common";
import { ProfileInfo, ProfileInterests, ProfileIntroduce, ProfileMbti } from "@/components/createprofile";
import { useProfileForm } from "@/hooks/users";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";
import { FormProvider } from "react-hook-form";

const ProfilePage: ActivityComponentType<"ProfilePage"> = () => {
  const { methods, handleSubmit, isFormValid, isPending } = useProfileForm();
  const isDisabled = !isFormValid || isPending;

  return (
    <AppScreen appBar={{ title: "프로필 설정" }}>
      <FormProvider {...methods}>
        <main className="bg-gradient-primary space-y-4 p-4 pb-8">
          {/* TODO: 프로필 사진 추가 */}
          <ProfileInfo />
          <ProfileInterests />
          <ProfileMbti />
          <ProfileIntroduce />
          <Button
            className="mt-8 h-12 font-semibold"
            variant={isDisabled ? "sub" : "main"}
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            {isPending ? "생성 중..." : "다음 단계"}
          </Button>
        </main>
      </FormProvider>
    </AppScreen>
  );
};

export default ProfilePage;
