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
      name: "CreateRoomPage",
    },
    { 
      name: "MenuSelectPage",
    }
    {
      name: "WaitingRoomPage",
    },
  ],
  initialActivity: () => "LandingPage",
});
