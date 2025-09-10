import { defineConfig } from "@stackflow/config";

export const config = defineConfig({
  transitionDuration: 300,
  activities: [
    {
      name: "LandingPage",
    },
    {
      name: "ProfilePage",
    },
    {
      name: "ProfileCheckPage",
    },
    {
      name: "ProfileViewPage",
    },
    {
      name: "ManittoPage",
    },
    {
      name: "CreateRoomPage",
    },
    {
      name: "MenuSelectPage",
    },
    {
      name: "WaitingRoomPage",
    },
    {
      name: "RandomRoulettePage",
    },
    {
      name: "TopicRecommendPage",
    },
  ],
  initialActivity: () => "LandingPage",
});
