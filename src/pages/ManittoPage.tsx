import { ProfileCard } from "@/components/profileview";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import type { Participant } from "@/hooks/profileview";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { PageLayout } from "@/layouts/PageLayout";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SYNC_DELAY = 200;

const ManittoPage = () => {
  useStageNavigation();
  const { handleBack, canGoBack } = useHandleBackPage();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";
  const { publish } = useStompPublish();
  const [myManitto, setMyManitto] = useState<string>();

  const handleManittoMessage = useCallback((message: IMessage) => {
    try {
      const response = JSON.parse(message.body) as BaseResponse<string>;
      setMyManitto(response.data);
    } catch {
      console.error("실패");
    }
  }, []);

  useStompSubscription("/user/queue/game-result", handleManittoMessage);

  useEffect(() => {
    if (!isHost || !roomId) return;

    const timer = setTimeout(() => {
      publish(`/app/room/${roomId}/start-game`, {
        roomCode: roomId,
        type: "MANITTO",
      });
    }, SYNC_DELAY);

    return () => clearTimeout(timer);
  }, [isHost, roomId, publish]);

  const manittoProfile: Participant = {
    id: 1,
    name: myManitto || "알 수 없음",
    age: 25,
    mbtiType: "ENFP",
    interests: ["스포츠", "음악", "영화", "독서", "여행", "요리", "게임", "동물"],
    introduction:
      "새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운 시간 보내요 새로운 사람들과 만나는 것을 좋아해요! 함께 즐거운",
  };

  return (
    <PageLayout
      appBar={{
        title: "마니또",
        backButton: canGoBack
          ? {
              onClick: handleBack,
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
    </PageLayout>
  );
};

export default ManittoPage;
