import { RandomRouletteTip, Roulette, RouletteSkeleton } from "@/components/randomroulette";
import type { GameResult } from "@/components/randomroulette/types";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import { useRoomParticipants } from "@/hooks/profileview";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { PageLayout } from "@/layouts/PageLayout";
import { getMessageBody } from "@/utils/stomp/getMessageBody";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

type GameResultResponse = BaseResponse<GameResult>;

const RandomRoulettePage = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";
  const { participants, isLoading } = useRoomParticipants(roomId);
  const { publish } = useStompPublish();
  useStageNavigation();
  const { handleBack, canGoBack } = useHandleBackPage();
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleGameResultMessage = useCallback((message: IMessage) => {
    const response = getMessageBody<GameResultResponse>(message);

    if (!response) {
      console.error("메시지 파싱 실패", message.body);
      return;
    }

    if (response.success) {
      setGameResult(response.data);
    }
  }, []);

  useStompSubscription(`/topic/game-result/${roomId}`, handleGameResultMessage);

  const handleStartGame = () => {
    if (!isHost || !roomId) {
      return;
    }

    publish(`/app/room/${roomId}/start-game`, {
      roomCode: roomId,
      type: "RANDOM_ROULETTE",
    });
  };

  return (
    <PageLayout
      appBar={{
        title: "룰렛",
        backButton: canGoBack
          ? {
              onClick: handleBack,
            }
          : { render: () => null },
      }}
    >
      <main className="bg-gradient-primary flex min-h-screen flex-col items-center space-y-4 overflow-x-hidden p-4 pb-8">
        {isLoading ? (
          <RouletteSkeleton />
        ) : (
          <Roulette participants={participants} gameResult={gameResult} isHost={isHost} onStartGame={handleStartGame} />
        )}
        <RandomRouletteTip />
      </main>
    </PageLayout>
  );
};
export default RandomRoulettePage;
