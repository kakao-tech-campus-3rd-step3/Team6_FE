import { ProfileCard, ProfileCardSkeleton } from "@/components/profileview";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import type { Participant } from "@/hooks/profileview";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { PageLayout } from "@/layouts/PageLayout";
import { useUserStore } from "@/store/useUserStore";
import { getMessageBody } from "@/utils/stomp/getMessageBody";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SYNC_DELAY = 200;

const ManittoPage = () => {
  useStageNavigation();
  const { handleBack, canGoBack } = useHandleBackPage();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";
  const { publish, isConnected } = useStompPublish();
  const [myManitto, setMyManitto] = useState<string>();
  const getParticipantByName = useUserStore((state) => state.getParticipantByName);

  const handleManittoMessage = useCallback((message: IMessage) => {
    const response = getMessageBody<BaseResponse<string>>(message);
    if (!response) {
      console.error("메시지 파싱 실패", message.body);
      return;
    }
    if (response.success) {
      setMyManitto(response.data);
    }
  }, []);

  useStompSubscription("/user/queue/game-result", handleManittoMessage);

  useEffect(() => {
    if (!isHost || !roomId || !isConnected) return;

    const timer = setTimeout(() => {
      publish(`/app/room/${roomId}/start-game`, {
        roomCode: roomId,
        type: "MANITTO",
      });
    }, SYNC_DELAY);

    return () => clearTimeout(timer);
  }, [isHost, roomId, isConnected, publish]);

  const manittoProfile: Participant | undefined = useMemo(() => {
    if (!myManitto) return undefined;
    return getParticipantByName(myManitto);
  }, [myManitto, getParticipantByName]);

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

          {!myManitto ? (
            <ProfileCardSkeleton />
          ) : manittoProfile ? (
            <ProfileCard profile={manittoProfile} />
          ) : (
            <div className="text-center text-gray-600">참가자 정보를 찾을 수 없습니다</div>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default ManittoPage;
