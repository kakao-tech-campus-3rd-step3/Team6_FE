import { useFlow } from "@stackflow/react/future";
import { MenuItem } from "./MenuItem";

const menu = [
  { id: "random",  title: "랜덤 질문", description: "룰렛을 돌려 질문을 받아보세요" },
  { id: "topic",   title: "주제 추천", description: "관심사 기반 대화 주제를 찾아보세요" },
  { id: "manitto", title: "마니또",   description: "새로운 마니또를 배정해보세요" },
  { id: "end",     title: "종료하기", description: "아이스브레이킹을 마무리합니다" },
] as const;

type MenuId = (typeof menu)[number]["id"];

const ACTIVITY_BY_MENU = {
  random:  "RandomPage",
  topic:   "TopicPage",
  manitto: "ManittoPage",
  end:     "FinishPage",
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
