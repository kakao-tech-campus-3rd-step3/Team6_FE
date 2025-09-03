import { MenuList } from "../components/menuselect";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";

const MenuSelectPage: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "아이스브레이킹" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <MenuList />
      </main>
    </AppScreen>
  );
};

export default MenuSelectPage;
