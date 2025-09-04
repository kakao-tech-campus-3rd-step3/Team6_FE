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
      name: "ProfileViewPage",
    },
    {
      name: "CreateRoomPage",
    },
    {
      name: "WaitingRoomPage",
    },
  ],
  initialActivity: () => "LandingPage",
});
