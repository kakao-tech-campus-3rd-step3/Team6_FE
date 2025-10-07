import { RandomRouletteTip, Roulette } from "@/components/randomroulette";
import { useHandleBackPage, useStageNavigation } from "@/hooks";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { type ActivityComponentType } from "@stackflow/react/future";

const RandomRoulettePage: ActivityComponentType<"RandomRoulettePage"> = () => {
  useStageNavigation();
  const handleBack = useHandleBackPage();

  return (
    <AppScreen
      appBar={{
        title: "룰렛",
        backButton: {
          onClick: () => {
            handleBack();
          },
        },
      }}
    >
      <main className="bg-gradient-primary flex min-h-screen flex-col items-center space-y-4 overflow-x-hidden p-4 pb-8">
        <Roulette />
        <RandomRouletteTip />
      </main>
    </AppScreen>
  );
};
export default RandomRoulettePage;
