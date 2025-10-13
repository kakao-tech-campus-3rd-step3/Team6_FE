import { IntroSection, MenuList } from "@/components/menuselect";
import { useStageNavigation } from "@/hooks";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { type ActivityComponentType } from "@stackflow/react";

const MenuSelectPage: ActivityComponentType = () => {
  useStageNavigation();

  return (
    <AppScreen appBar={{ title: "아이스브레이킹" }}>
      <main className="bg-gradient-primary min-h-screen space-y-4 p-4 pb-8">
        <IntroSection />
        <MenuList />
      </main>
    </AppScreen>
  );
};

export default MenuSelectPage;
