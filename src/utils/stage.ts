type StageConfig = {
  path: string;
  getSearchParams: (roomId: string, isHost: boolean) => URLSearchParams;
};

const STAGE_CONFIG: Record<string, StageConfig> = {
  PROFILE_VIEW_STAGE: {
    path: "/profile-view",
    getSearchParams: (roomId, isHost) => {
      const params = new URLSearchParams();
      params.set("roomId", roomId);
      params.set("isHost", String(isHost));
      return params;
    },
  },
  GAME_LIST_STAGE: {
    path: "/menu",
    getSearchParams: (roomId, isHost) => {
      const params = new URLSearchParams();
      params.set("roomId", roomId);
      params.set("isHost", String(isHost));
      return params;
    },
  },
  MANITTO_STAGE: {
    path: "/manitto",
    getSearchParams: (roomId, isHost) => {
      const params = new URLSearchParams();
      params.set("roomId", roomId);
      params.set("isHost", String(isHost));
      return params;
    },
  },
  TOPIC_RECOMMEND_STAGE: {
    path: "/topic-recommend",
    getSearchParams: (roomId, isHost) => {
      const params = new URLSearchParams();
      params.set("roomId", roomId);
      params.set("isHost", String(isHost));
      return params;
    },
  },
  RANDOM_ROULETTE_STAGE: {
    path: "/random-roulette",
    getSearchParams: (roomId, isHost) => {
      const params = new URLSearchParams();
      params.set("roomId", roomId);
      params.set("isHost", String(isHost));
      return params;
    },
  },
  ENDING_STAGE: {
    path: "/ending",
    getSearchParams: (roomId, isHost) => {
      const params = new URLSearchParams();
      params.set("roomId", roomId);
      params.set("isHost", String(isHost));
      return params;
    },
  },
};

export const getPageFromStage = (stage: string, roomId: string, isHost: boolean): string | null => {
  const config = STAGE_CONFIG[stage];

  if (!config) {
    return null;
  }

  const searchParams = config.getSearchParams(roomId, isHost);
  return `${config.path}?${searchParams.toString()}`;
};
