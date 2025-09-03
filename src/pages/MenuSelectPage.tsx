import { IntroSection } from "@/components/menuselect/IntroSection";
import { RoleBadge } from "@/components/menuselect/RoleBadge";
//import { MenuList } from "@/components/menuselect";
import { MenuWaiting } from "@/components/menuselect/MenuWaiting";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";

const MenuSelectPage: ActivityComponentType = () => {
  // 나중에 로그인 사용자 정보나 방 참여 API로 role 가져오기
  const role = "구성원"; // or "방장"

  return (
    <AppScreen appBar={{ title: "아이스브레이킹" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <IntroSection />
        <RoleBadge role={role} />
        {/*<MenuList />*/}
        <MenuWaiting />
      </main>
    </AppScreen>
  );
};

export default MenuSelectPage;
