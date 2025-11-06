import type { MenuId } from "@/components/menuselect";
import { MENU } from "@/constants";
import { useStompPublish, useStompSubscription } from "@/hooks/stomp";
import { setLastEventType } from "@/hooks/useStageNavigation";
import { getMessageBody } from "@/utils/stomp/getMessageBody";
import type { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { MenuItem } from "./MenuItem";

const SYNC_DELAY = 300;
export const MenuList = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const isHost = searchParams.get("isHost") === "true";

  const { publish, isConnected } = useStompPublish();

  const handleGameListMessage = useCallback((message: IMessage) => {
    const response = getMessageBody<BaseResponse<string[]>>(message);

    if (!response) {
      console.error("메시지 파싱 실패", message.body);
      return;
    }

    if (response.success) {
      //TODO : data랑 Menu 어떻게 섞을지
    } else {
      console.error("게임 목록 조회 실패", response.message);
    }
  }, []);

  useStompSubscription(isHost ? `/topic/game-list/${roomId}` : null, handleGameListMessage);

  useEffect(() => {
    if (!roomId || !isHost || !isConnected) {
      return;
    }

    const timer = setTimeout(() => {
      publish(`/app/room/${roomId}/game-list`, {});
    }, SYNC_DELAY);

    return () => clearTimeout(timer);
  }, [roomId, isHost, isConnected, publish]);

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
