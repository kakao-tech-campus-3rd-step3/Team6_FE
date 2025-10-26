import { IntroSection, MenuList } from "@/components/menuselect";
import { useStageNavigation } from "@/hooks";
import { PageLayout } from "@/layouts/PageLayout";

const MenuSelectPage = () => {
  useStageNavigation();

  return (
    <PageLayout appBar={{ title: "게임 선택" }}>
      <main className="bg-gradient-primary min-h-screen space-y-4 p-4 pb-8">
        <IntroSection />
        <MenuList />
      </main>
    </PageLayout>
  );
};

export default MenuSelectPage;
