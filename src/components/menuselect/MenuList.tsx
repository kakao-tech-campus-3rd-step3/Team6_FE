import type { MenuId } from "@/components/menuselect";
import { MENU } from "@/constants";
import { useStompPublish } from "@/hooks/stomp";
import { setLastEventType } from "@/hooks/useStageNavigation";
import { useActivity } from "@stackflow/react/future";

import { MenuItem } from "./MenuItem";

export const MenuList = () => {
  const { params } = useActivity();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const isHost = params?.isHost === "true";

  const { publish } = useStompPublish();

  const handleChangeGame = (id: MenuId) => {
    if (!isHost || !roomId) return;
    setLastEventType(roomId, "SELECT");
    publish(`/app/room/${roomId}/change-stage`, {
      eventType: "SELECT",
      stage: id,
    });
  };
  return (
    <section className="space-y-4">
      <fieldset>
        <div className="space-y-3" role="list">
          {MENU.map((m) => (
            <MenuItem
              key={m.id}
              variant={m.id}
              title={m.title}
              description={m.description}
              onClick={() => handleChangeGame(m.id)}
            />
          ))}
        </div>
      </fieldset>
    </section>
  );
};
