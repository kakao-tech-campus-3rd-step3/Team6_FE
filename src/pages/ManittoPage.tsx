import { ProfileCard } from "@/components/profileview";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import type { Participant } from "@/hooks/profileview";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";

const ManittoPage: ActivityComponentType<"ManittoPage"> = () => {
  useStageNavigation();
  const { handleBack, canGoBack } = useHandleBackPage();

  const manittoProfile: Participant = {
    id: 1,
    name: "김민수",
    age: 25,
    mbtiType: "ENFP",
    interests: ["스포츠", "음악", "영화", "독서", "여행", "요리", "게임", "동물"],
    introduction:
      "새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운",
  };

  return (
    <AppScreen
      appBar={{
        title: "마니또",
        backButton: canGoBack
          ? {
              onClick: () => {
                handleBack();
              },
            }
          : { render: () => null },
      }}
    >
      <main className="bg-gradient-primary min-h-screen p-4">
        <div className="flex flex-col items-center">
          <div className="mb-6 text-center">
            <p className="text-xl font-semibold text-black">나의 마니또를 확인하세요</p>
          </div>

          <ProfileCard profile={manittoProfile} />
        </div>
      </main>
    </AppScreen>
  );
};

export default ManittoPage;
