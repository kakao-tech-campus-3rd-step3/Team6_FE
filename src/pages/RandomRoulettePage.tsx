import { RandomRouletteTip, Roulette } from "@/components/randomroulette";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import { useRoomParticipants } from "@/hooks/profileview";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { PageLayout } from "@/layouts/PageLayout";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface GameResultData {
  userName: string;
  question: {
    content: string;
  };
}

type GameResult = BaseResponse<GameResultData>;

const RandomRoulettePage = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";
  const { participants } = useRoomParticipants(roomId);
  const { publish } = useStompPublish();
  useStageNavigation();
  const { handleBack, canGoBack } = useHandleBackPage();
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleGameResultMessage = useCallback((message: IMessage) => {
    try {
      const response = JSON.parse(message.body) as GameResult;

      if (response.success) {
        setGameResult(response);
      }
    } catch (error) {
      console.error("게임 결과 파싱 실패", error);
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
        <Roulette
          participants={participants}
          gameResult={gameResult?.data}
          isHost={isHost}
          onStartGame={handleStartGame}
        />
        <RandomRouletteTip />
      </main>
    </PageLayout>
  );
};
export default RandomRoulettePage;
