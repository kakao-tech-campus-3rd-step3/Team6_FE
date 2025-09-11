import { menu } from "@/constants/menu";
import { useFlow } from "@stackflow/react/future";

import { MenuItem } from "./MenuItem";

type MenuId = (typeof menu)[number]["id"];

const ACTIVITY_BY_MENU = {
  random: "RandomRoulettePage",
  topic: "TopicPage",
  manitto: "ManittoPage",
  end: "EndingPage",
} as const satisfies Record<MenuId, string>;

export const MenuList = () => {
  const { push } = useFlow();

  const handleMenuClick = (id: MenuId) => {
    const activityName = ACTIVITY_BY_MENU[id];
    push(activityName, {});
  };

  return (
    <section className="space-y-4">
      <fieldset>
        <div className="space-y-3" role="list">
          {menu.map((m) => (
            <MenuItem
              key={m.id}
              variant={m.id}
              title={m.title}
              description={m.description}
              onClick={() => handleMenuClick(m.id)}
            />
          ))}
        </div>
      </fieldset>
    </section>
  );
};
