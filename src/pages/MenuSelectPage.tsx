import { IntroSection, MenuList, RoleBadge, MenuWaiting } from "@/components/menuselect";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";
import type { Role } from "@/components/menuselect/RoleBadge";

const MenuSelectPage: ActivityComponentType = () => {
  // 나중에 로그인 사용자 정보나 방 참여 API로 role 가져오기
  const role: Role = "방장"; // or "구성원"

  return (
    <AppScreen appBar={{ title: "아이스브레이킹" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <IntroSection />
        <RoleBadge role={role} />

        {role === "방장" ? <MenuList /> : <MenuWaiting />} 
        {/* 현재는 고정된 role 값 기준으로 분기 처리. 추후 role 값을 받아와 수정*/}
      </main>
    </AppScreen>
  );
};

export default MenuSelectPage;
