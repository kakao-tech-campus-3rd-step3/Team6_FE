import { defineConfig } from "@stackflow/config";

export const config = defineConfig({
  transitionDuration: 300,
  activities: [
    {
      name: "LandingPage",
      route: "/",
    },
    {
      name: "ProfilePage",
      route: "/profile",
    },
    {
      name: "ProfileCheckPage",
      route: "/profile-check",
    },
    {
      name: "ProfileViewPage",
      route: "/profile-view",
    },
    {
      name: "ManittoPage",
      route: "/manitto",
    },
    {
      name: "CreateRoomPage",
      route: "/create-room",
    },
    {
      name: "MenuSelectPage",
      route: "/menu",
    },
    {
      name: "WaitingRoomPage",
      route: "/waiting-room/:roomId",
    },
    {
      name: "RandomRoulettePage",
      route: "/random-roulette",
    },
    {
      name: "EndingPage",
      route: "/ending",
    },
    {
      name: "TopicRecommendPage",
      route: "/topic-recommend",
    },
  ],
  initialActivity: () => "LandingPage",
});
