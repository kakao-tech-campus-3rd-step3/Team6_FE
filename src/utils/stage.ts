type StageConfig = {
  activity: string;
  getParams: (roomId: string, isHost: boolean) => Record<string, string>;
};

const STAGE_CONFIG: Record<string, StageConfig> = {
  PROFILE_VIEW_STAGE: {
    activity: "ProfileViewPage",
    getParams: (roomId, isHost) => ({
      title: "프로필 소개",
      roomId,
      isHost: String(isHost),
    }),
  },
  GAME_LIST_STAGE: {
    activity: "MenuSelectPage",
    getParams: (roomId, isHost) => ({
      roomId,
      isHost: String(isHost),
    }),
  },
  MANITTO_STAGE: {
    activity: "ManittoPage",
    getParams: (roomId, isHost) => ({
      roomId,
      isHost: String(isHost),
    }),
  },
  TOPIC_RECOMMEND_STAGE: {
    activity: "TopicRecommendPage",
    getParams: (roomId, isHost) => ({
      roomId,
      isHost: String(isHost),
    }),
  },
  RANDOM_ROULETTE_STAGE: {
    activity: "RandomRoulettePage",
    getParams: (roomId, isHost) => ({
      roomId,
      isHost: String(isHost),
    }),
  },
  ENDING_STAGE: {
    activity: "EndingPage",
    getParams: (roomId, isHost) => ({
      roomId,
      isHost: String(isHost),
    }),
  },
};

export const getPageFromStage = (
  stage: string,
  roomId: string,
  isHost: boolean,
): { activity: string; params?: Record<string, string> } | null => {
  const config = STAGE_CONFIG[stage];

  if (!config) {
    return null;
  }

  return {
    activity: config.activity,
    params: config.getParams(roomId, isHost),
  };
};
