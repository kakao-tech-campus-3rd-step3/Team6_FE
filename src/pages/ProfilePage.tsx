import { Button } from "@/components/common";
import { ProfileInfo, ProfileInterests, ProfileIntroduce, ProfileMbti } from "@/components/createprofile";
import { useProfileForm } from "@/hooks/users";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";

const ProfilePage: ActivityComponentType<"ProfilePage"> = () => {
  const { formData, updateField, handleSubmit, isFormValid, isPending } = useProfileForm();

  return (
    <AppScreen appBar={{ title: "프로필 설정" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        {/* TODO: 프로필 사진 추가 */}
        <ProfileInfo
          data={{ name: formData.name, phone: formData.phone, age: formData.age }}
          onChange={(field, value) => updateField(field, value)}
        />
        <ProfileInterests
          interests={formData.interests}
          onInterestsChange={(interests) => updateField("interests", interests)}
        />
        <ProfileMbti mbti={formData.mbti} onMbtiChange={(mbti) => updateField("mbti", mbti)} />
        <ProfileIntroduce
          introduction={formData.introduction}
          onIntroductionChange={(introduction) => updateField("introduction", introduction)}
        />
        <Button className="mt-8 h-12 font-semibold" onClick={handleSubmit} disabled={!isFormValid || isPending}>
          {isPending ? "생성 중..." : "다음 단계"}
        </Button>
      </main>
    </AppScreen>
  );
};

export default ProfilePage;
