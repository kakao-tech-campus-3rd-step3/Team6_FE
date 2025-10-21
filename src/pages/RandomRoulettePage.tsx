import { RandomRouletteTip, Roulette } from "@/components/randomroulette";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import { useRoomParticipants } from "@/hooks/profileview";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { type ActivityComponentType, useActivity } from "@stackflow/react/future";

const RandomRoulettePage: ActivityComponentType<"RandomRoulettePage"> = () => {
  const { params } = useActivity();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const { participants } = useRoomParticipants(roomId);
  useStageNavigation();
  const { handleBack, canGoBack } = useHandleBackPage();

  return (
    <AppScreen
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
        <Roulette participants={participants} />
        <RandomRouletteTip />
      </main>
    </AppScreen>
  );
};
export default RandomRoulettePage;
